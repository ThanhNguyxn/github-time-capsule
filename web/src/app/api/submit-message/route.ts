import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { Octokit } from '@octokit/rest';
import { validation, securityHeaders } from '@/lib/validation';
import { rateLimit } from '@/lib/rate-limit';
import config from '@/lib/env';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Get session
    const session = await getServerSession(authOptions) as any;
    
    if (!session || !session.user || !session.accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401, headers: securityHeaders }
      );
    }

    // Rate limiting
    const identifier = session.user.email || session.user.username || 'unknown';
    const rateLimitResult = rateLimit(
      identifier,
      config.rateLimit.maxRequests,
      config.rateLimit.windowMs
    );

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: `Rate limit exceeded. Try again in ${Math.ceil((rateLimitResult.reset - Date.now()) / 1000)} seconds.`,
          retryAfter: rateLimitResult.reset 
        },
        { 
          status: 429,
          headers: {
            ...securityHeaders,
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
          }
        }
      );
    }

    // Parse request body
    const body = await request.json();
    const { message } = body;
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Missing message content' },
        { status: 400, headers: securityHeaders }
      );
    }

    // Validate message (basic validation)
    if (message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message cannot be empty' },
        { status: 400, headers: securityHeaders }
      );
    }

    // Simple obfuscation to prevent message from being visible in PR diff
    // This is not secure encryption, just to hide from casual viewing
    const obfuscatedBytes = Buffer.from(message, 'utf8')
      .map((byte, index) => byte ^ (index % 256));
    const obfuscated = Buffer.from(obfuscatedBytes).toString('base64');

    // Initialize Octokit with user's access token
    const octokit = new Octokit({
      auth: session.accessToken,
    });

    const owner = config.github.repoOwner;
    const repo = config.github.repoName;
    const branchName = `add-message-${session.user.username}-${Date.now()}`;
    const isRepoOwner = session.user.username === owner;

    // Step 1: Determine repo location based on user
    let userRepoOwner: string;
    
    if (isRepoOwner) {
      // Repo owner can't fork their own repo - use main repo
      userRepoOwner = owner;
      console.log('User is repo owner - using main repo');
    } else {
      // External users - fork the repository (if not already forked)
      userRepoOwner = session.user.username;
      try {
        await octokit.repos.get({
          owner: session.user.username,
          repo: repo,
        });
        console.log('Fork already exists');
      } catch (error: any) {
        if (error.status === 404) {
          // Repo doesn't exist, create fork
          console.log('Creating fork...');
          await octokit.repos.createFork({
            owner,
            repo,
          });
          
          // Wait a bit for fork to be created
          await new Promise(resolve => setTimeout(resolve, 3000));
          console.log('Fork created successfully');
        } else {
          throw error;
        }
      }
    }

    // Step 2: Get the default branch SHA
    const { data: refData } = await octokit.git.getRef({
      owner: userRepoOwner,
      repo,
      ref: 'heads/main',
    });
    const mainSha = refData.object.sha;

    // Step 3: Create a new branch
    await octokit.git.createRef({
      owner: userRepoOwner,
      repo,
      ref: `refs/heads/${branchName}`,
      sha: mainSha,
    });

    // Step 4: Save the obfuscated message in the messages folder
    // This prevents the message from being visible in PR diff
    // The workflow will deobfuscate, encrypt with GPG, and move to sealed/ folder
    const messageFileName = `messages/${session.user.username}.txt`;
    await octokit.repos.createOrUpdateFileContents({
      owner: userRepoOwner,
      repo,
      path: messageFileName,
      message: `Add obfuscated message from ${session.user.username}`,
      content: obfuscated,
      encoding: 'base64',
      branch: branchName,
    });

    // Note: Rate limit (1 message per day UTC) is enforced by the GitHub Actions workflow
    // The workflow checks the sealed folder in the main repository

    // Step 5: Create pull request
    // Format depends on whether it's same-repo or fork PR
    const prHead = isRepoOwner 
      ? branchName  // Same-repo format (triggers pull_request)
      : `${userRepoOwner}:${branchName}`;  // Fork format (triggers pull_request_target)
    
    const { data: prData } = await octokit.pulls.create({
      owner,
      repo,
      title: `Time Capsule Message from @${session.user.username}`,
      head: prHead,
      base: 'main',
      body: `🕰️ **Time Capsule Message Submission**

👤 **From:** @${session.user.username}
📅 **Date:** ${new Date().toLocaleDateString()}
🔒 **Will be sealed until:** January 1, 2035

---

This message has been submitted through the Time Capsule web interface.
It will be automatically encrypted and sealed by GitHub Actions.

**What happens next:**
1. ✅ Automated checks will verify the submission
2. 🔒 The message will be encrypted with GPG
3. 📦 Stored in the \`sealed/\` folder
4. 🎉 This PR will be automatically closed
5. ⏰ The message will unlock on January 1, 2035!

---

*Automated submission • Do not edit this PR*`,
    });

    // Success!
    // The PR will automatically trigger the seal-the-capsule workflow via pull_request_target event
    return NextResponse.json(
      {
        success: true,
        prNumber: prData.number,
        prUrl: prData.html_url,
        message: 'Your message has been submitted and will be sealed shortly!',
      },
      {
        status: 200,
        headers: {
          ...securityHeaders,
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        },
      }
    );

  } catch (error: any) {
    console.error('Error submitting message:', error);

    // Handle specific GitHub API errors
    if (error.status === 422) {
      return NextResponse.json(
        { error: 'A message from your account already exists or PR already open' },
        { status: 400, headers: securityHeaders }
      );
    }

    if (error.status === 403) {
      return NextResponse.json(
        { error: 'GitHub API rate limit exceeded. Please try again later.' },
        { status: 429, headers: securityHeaders }
      );
    }

    return NextResponse.json(
      { error: 'An error occurred while submitting your message. Please try again.' },
      { status: 500, headers: securityHeaders }
    );
  }
}

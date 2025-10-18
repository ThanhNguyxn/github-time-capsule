import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { Octokit } from '@octokit/rest';
import { validation, securityHeaders } from '@/lib/validation';
import { rateLimit } from '@/lib/rate-limit';
import config from '@/lib/env';
import { authOptions } from '@/lib/auth';
import { encryptMessage } from '@/lib/encrypt';

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

    // Encrypt the message
    let encrypted;
    try {
      const encryptedBuffer = await encryptMessage(message);
      encrypted = Buffer.from(encryptedBuffer).toString('base64');
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to encrypt message' },
        { status: 500, headers: securityHeaders }
      );
    }

    // Initialize Octokit with user's access token
    const octokit = new Octokit({
      auth: session.accessToken,
    });

    const owner = config.github.repoOwner;
    const repo = config.github.repoName;
    const branchName = `add-message-${session.user.username}-${Date.now()}`;

    // Step 1: Fork the repository (if not already forked)
    const userRepoOwner = session.user.username;
    try {
      await octokit.repos.get({
        owner: session.user.username,
        repo: repo,
      });
    } catch (error: any) {
      if (error.status === 404) {
        // Repo doesn't exist, create fork
        await octokit.repos.createFork({
          owner,
          repo,
        });
        
        // Wait a bit for fork to be created
        await new Promise(resolve => setTimeout(resolve, 3000));
      } else {
        throw error;
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

    // Step 4: Create the encrypted message file in user-specific folder
    const userFolder = `messages/${session.user.username}`;
    const { data: existingFiles } = await octokit.repos.getContent({
      owner: userRepoOwner,
      repo,
      path: userFolder,
      ref: branchName,
    }).catch(() => ({ data: [] })); // If folder doesn't exist, initialize as empty

    let fileName = `${userFolder}/${session.user.username}.gpg`;
    if (Array.isArray(existingFiles)) {
      const existingFileNames = existingFiles.map(file => file.name);
      let counter = 1;
      while (existingFileNames.includes(`${session.user.username}(${counter}).gpg`)) {
        counter++;
      }
      fileName = `${userFolder}/${session.user.username}(${counter}).gpg`;
    }

    // Check rate limit (1 submission per day, except for the repository owner)
    if (session.user.username !== owner && session.user.email !== 'thanhnguyentuan2007@gmail.com') {
      const today = new Date().toISOString().split('T')[0];
      const recentFile = Array.isArray(existingFiles)
        ? existingFiles.find((file: any) => file.name.startsWith(session.user.username) && file.name.endsWith('.gpg'))
        : undefined;

      if (recentFile && recentFile.name.includes(today)) {
        return NextResponse.json(
          { error: 'You can only submit one message per day.' },
          { status: 429, headers: securityHeaders }
        );
      }
    }

    await octokit.repos.createOrUpdateFileContents({
      owner: userRepoOwner,
      repo,
      path: fileName,
      message: `Add encrypted message from ${session.user.username}`,
      content: encrypted,
      encoding: 'base64',
      branch: branchName,
    });

    // Step 5: Create pull request to original repo
    const { data: prData } = await octokit.pulls.create({
      owner,
      repo,
      title: `Time Capsule Message from @${session.user.username}`,
      head: `${userRepoOwner}:${branchName}`,
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

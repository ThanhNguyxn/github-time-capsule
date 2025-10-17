import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import { securityHeaders } from '@/lib/validation';
import config from '@/lib/env';

export async function GET() {
  try {
    const octokit = new Octokit();
    const owner = config.github.repoOwner;
    const repo = config.github.repoName;

    // Get sealed messages count
    let messageCount = 0;
    try {
      const { data: files } = await octokit.repos.getContent({
        owner,
        repo,
        path: 'sealed',
      });

      if (Array.isArray(files)) {
        messageCount = files.filter(file => file.name.endsWith('.gpg')).length;
      }
    } catch (error: any) {
      // If sealed folder doesn't exist yet, count is 0
      if (error.status !== 404) {
        throw error;
      }
    }

    // Get contributors count
    let contributorCount = 0;
    try {
      const { data: contributors } = await octokit.repos.listContributors({
        owner,
        repo,
        per_page: 1,
        anon: 'true',
      });
      
      // GitHub returns the total count in the Link header
      // For simplicity, we'll use a rough estimate
      contributorCount = messageCount; // Each message = 1 contributor (roughly)
    } catch (error) {
      console.error('Error fetching contributors:', error);
    }

    // Calculate days until 2035
    const targetDate = new Date('2035-01-01T00:00:00Z');
    const now = new Date();
    const daysUntil = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return NextResponse.json(
      {
        messages: messageCount,
        contributors: contributorCount,
        daysUntil: Math.max(0, daysUntil),
      },
      {
        status: 200,
        headers: {
          ...securityHeaders,
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching statistics:', error);
    
    // Return fallback data
    return NextResponse.json(
      {
        messages: 0,
        contributors: 0,
        daysUntil: 3363,
      },
      {
        status: 200,
        headers: securityHeaders,
      }
    );
  }
}

// /api/sync-github.ts

// IMPORTANT SETUP:
// To make this function work, you MUST create an Environment Variable in your Vercel project settings.
// Name: GITHUB_PAT
// Value: Your GitHub Personal Access Token with 'repo' scope.
// This keeps your token secure on the server.

// This is an Edge Function for performance
export const config = {
  runtime: 'edge',
};

// Fix: Import Buffer to make it available in the edge runtime.
import { Buffer } from 'buffer';

// SECURITY WARNING: The PAT should be stored as a secure environment variable in your hosting provider (e.g., Vercel).
const GITHUB_PAT = process.env.GITHUB_PAT;

// Helper to Base64 encode string content for the GitHub API.
// In a Node.js/Edge environment, Buffer is the standard way.
const encodeContent = (content: string): string => {
    return Buffer.from(content, 'utf-8').toString('base64');
};

// Function to get the current SHA of the file, required for updates.
const getFileSha = async (apiUrl: string, pat: string): Promise<string | undefined> => {
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `token ${pat}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Cyber-Training-Dashboard-Sync'
            },
        });
        if (response.ok) {
            const data = await response.json();
            return data.sha;
        }
        if (response.status === 404) return undefined; // File doesn't exist, we'll create it.
        
        console.error('GitHub API error (getFileSha):', response.status, await response.text());
        return undefined;
    } catch (error) {
        console.error('Failed to fetch file SHA from GitHub:', error);
        return undefined;
    }
};


export default async function POST(request: Request) {
   if (!GITHUB_PAT) {
     return new Response(JSON.stringify({ error: 'GitHub PAT is not configured on the server. Please set the GITHUB_PAT environment variable.' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
  try {
    const appData = await request.json();
    
    // Simple validation
    if (!appData.users || !appData.quizzes || !appData.settings) {
        return new Response(JSON.stringify({ error: 'Invalid data structure for sync' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 400,
        });
    }

    const { settings } = appData;
    const githubOwner = settings?.githubOwner;
    const githubRepo = settings?.githubRepo;
    const filePath = settings?.githubPath;

    if (!githubOwner || !githubRepo || !filePath) {
         return new Response(JSON.stringify({ error: 'GitHub repository details are not configured in application settings.' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 400,
        });
    }
    
    const GITHUB_API_URL = `https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${filePath}`;

    const fileSha = await getFileSha(GITHUB_API_URL, GITHUB_PAT);
    const contentToSave = JSON.stringify(appData, null, 2);
    const encodedContent = encodeContent(contentToSave);
    const commitMessage = `Automated data sync: ${new Date().toISOString()}`;
    const payload: { message: string; content: string; sha?: string } = {
        message: commitMessage,
        content: encodedContent,
    };
    if (fileSha) {
        payload.sha = fileSha;
    }

    const response = await fetch(GITHUB_API_URL, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${GITHUB_PAT}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'User-Agent': 'Cyber-Training-Dashboard-Sync'
        },
        body: JSON.stringify(payload),
    });

    if (response.ok) {
        const result = await response.json();
        console.log('Successfully synced data to GitHub:', result.commit.sha);
        return new Response(JSON.stringify({ success: true, commit: result.commit.sha }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        });
    } else {
        const errorText = await response.text();
        console.error('GitHub API error (syncToGithub):', response.status, errorText);
        return new Response(JSON.stringify({ error: `GitHub API Error: ${errorText}` }), {
            headers: { 'Content-Type': 'application/json' },
            status: response.status,
        });
    }
  } catch (error: any) {
    console.error('Failed to sync data to GitHub:', error);
    return new Response(JSON.stringify({ error: 'Failed to sync data to GitHub', details: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}
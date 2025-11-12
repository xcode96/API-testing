import { Buffer } from 'buffer';

export const maxDuration = 60; // Set a longer timeout for GitHub API calls

export default async function POST(request: Request) {
    try {
        const { owner, repo, path, pat } = await request.json();

        if (!owner || !repo || !path || !pat) {
            return new Response(JSON.stringify({ error: 'Missing GitHub configuration parameters.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        
        // A single, direct call to the contents API is more robust.
        // It defaults to the HEAD of the default branch.
        const contentUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
        
        const response = await fetch(contentUrl, {
            headers: {
                'Authorization': `token ${pat}`,
                'Accept': 'application/vnd.github.v3+json',
                // Explicitly ask for fresh data from GitHub's servers
                'X-GitHub-Api-Version': '2022-11-28'
            },
            // This header tells Vercel's fetch and network to not cache the response.
            cache: 'no-store',
        });

        if (!response.ok) {
             const errorData = await response.json();
             console.error('GitHub API error:', errorData);
             const errorMessage = `GitHub API Error (${response.status}): ${errorData.message || 'Could not fetch file. Check owner, repo, path, and token permissions.'}`;
             return new Response(JSON.stringify({ error: errorMessage }), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const responseData = await response.json();
        if (responseData.content === undefined) {
             return new Response(JSON.stringify({ error: 'File content not found in GitHub API response. The file might be empty or a submodule.' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const fileContent = Buffer.from(responseData.content, 'base64').toString('utf-8');
        const data = JSON.parse(fileContent);

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error: any) {
        console.error('Error in GitHub proxy:', error);
        return new Response(JSON.stringify({ error: 'An internal server error occurred in the proxy.', details: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

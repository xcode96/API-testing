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
        
        const commonHeaders = {
            'Authorization': `token ${pat}`,
            'Accept': 'application/vnd.github.v3+json',
        };
        const commonFetchOptions: RequestInit = {
            headers: commonHeaders,
            // FIX: Replaced non-standard `next` property with standard `cache` property to resolve TypeScript error.
            // This achieves the same goal of preventing caching.
            cache: 'no-store',
        };

        // Step 1: Get the latest commit SHA from the default branch to ensure we get the freshest data
        const commitsUrl = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`;
        const commitsResponse = await fetch(commitsUrl, commonFetchOptions);
        
        if (!commitsResponse.ok) {
            const errorText = await commitsResponse.json();
            console.error('GitHub API (commits) error:', errorText);
            const errorMessage = `GitHub API Error (${commitsResponse.status}): ${errorText.message || 'Could not fetch repository commits. Check owner, repo, and token permissions.'}`;
            return new Response(JSON.stringify({ error: errorMessage }), {
                status: commitsResponse.status,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const commitsData = await commitsResponse.json();
        if (!commitsData || commitsData.length === 0 || !commitsData[0].sha) {
            return new Response(JSON.stringify({ error: 'Could not find the latest commit SHA. The repository might be empty.' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        const latestSha = commitsData[0].sha;

        // Step 2: Fetch the file content using the specific commit SHA
        const contentUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${latestSha}`;
        const contentResponse = await fetch(contentUrl, commonFetchOptions);

        if (!contentResponse.ok) {
             const errorText = await contentResponse.json();
             console.error('GitHub API (contents) error:', errorText);
             const errorMessage = `GitHub API Error (${contentResponse.status}): ${errorText.message || 'Could not fetch file content. Check file path.'}`;
             return new Response(JSON.stringify({ error: errorMessage }), {
                status: contentResponse.status,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const responseData = await contentResponse.json();
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
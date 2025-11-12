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
        
        const contentUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
        const commonHeaders = {
            'Authorization': `token ${pat}`,
            'Accept': 'application/vnd.github.v3+json',
            'X-GitHub-Api-Version': '2022-11-28'
        };

        // Step 1: Try to get the file metadata (and content if < 1MB)
        const contentResponse = await fetch(contentUrl, {
            headers: commonHeaders,
            cache: 'no-store',
        });

        if (!contentResponse.ok) {
            const errorData = await contentResponse.json();
            console.error('GitHub Contents API error:', errorData);
            const errorMessage = `GitHub API Error (${contentResponse.status}): ${errorData.message || 'Could not fetch file metadata. Check owner, repo, path, and token permissions.'}`;
            return new Response(JSON.stringify({ error: errorMessage }), {
                status: contentResponse.status,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const contentData = await contentResponse.json();
        let fileContentBase64: string;

        // Step 2: Check if content is included directly or if we need to fetch the blob
        if (contentData.content) {
            // File is < 1MB, content is directly available
            fileContentBase64 = contentData.content;
        } else if (contentData.sha) {
            // File is > 1MB, fetch content from the Git Blobs API
            const blobUrl = `https://api.github.com/repos/${owner}/${repo}/git/blobs/${contentData.sha}`;
            const blobResponse = await fetch(blobUrl, {
                headers: commonHeaders,
                cache: 'no-store',
            });

            if (!blobResponse.ok) {
                 const errorData = await blobResponse.json();
                 console.error('GitHub Blobs API error:', errorData);
                 const errorMessage = `GitHub API Error (${blobResponse.status}): ${errorData.message || 'Could not fetch large file content.'}`;
                 return new Response(JSON.stringify({ error: errorMessage }), {
                    status: blobResponse.status,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            const blobData = await blobResponse.json();
            fileContentBase64 = blobData.content;
        } else {
             return new Response(JSON.stringify({ error: 'Invalid response from GitHub Contents API. No content or SHA found.' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Step 3: Decode and parse the content
        if (!fileContentBase64) {
            return new Response(JSON.stringify({ error: 'File appears to be empty.' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        
        const fileContent = Buffer.from(fileContentBase64, 'base64').toString('utf-8');
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

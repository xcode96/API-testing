import { Buffer } from 'buffer';

export const maxDuration = 60; // Set a longer timeout for GitHub API calls

const RESPONSE_HEADERS = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
};

export default async function POST(request: Request) {
    try {
        const { owner, repo, path, pat } = await request.json();

        if (!owner || !repo || !path || !pat) {
            return new Response(JSON.stringify({ error: 'Missing GitHub configuration parameters.' }), {
                status: 400,
                headers: RESPONSE_HEADERS,
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
                headers: RESPONSE_HEADERS,
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
                    headers: RESPONSE_HEADERS,
                });
            }
            const blobData = await blobResponse.json();
            fileContentBase64 = blobData.content;
        } else {
             return new Response(JSON.stringify({ error: 'Invalid response from GitHub Contents API. No content or SHA found.' }), {
                status: 404,
                headers: RESPONSE_HEADERS,
            });
        }

        // Step 3: Decode and parse the content
        if (!fileContentBase64) {
            return new Response(JSON.stringify({ error: 'File appears to be empty.' }), {
                status: 404,
                headers: RESPONSE_HEADERS,
            });
        }
        
        const fileContent = Buffer.from(fileContentBase64, 'base64').toString('utf-8');
        
        let data;
        try {
            data = JSON.parse(fileContent);
        } catch (parseError: any) {
            console.error('JSON parsing error in GitHub proxy:', parseError.message);
            // Provide a user-friendly error message indicating the file is malformed.
            const errorMessage = `The file '${path}' from your repository is not valid JSON. Please check the file's syntax. Details: ${parseError.message}`;
             return new Response(JSON.stringify({ error: errorMessage }), {
                status: 400, // Bad Request, as the source file is malformed.
                headers: RESPONSE_HEADERS,
            });
        }

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: RESPONSE_HEADERS,
        });

    } catch (error: any) {
        console.error('Error in GitHub proxy:', error);
        return new Response(JSON.stringify({ error: 'An internal server error occurred in the proxy.', details: error.message }), {
            status: 500,
            headers: RESPONSE_HEADERS,
        });
    }
}

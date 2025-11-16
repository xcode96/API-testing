
import { Buffer } from 'buffer';

export const maxDuration = 60;

const RESPONSE_HEADERS = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
};

async function getFileSha(url: string, headers: HeadersInit): Promise<string | null> {
    const response = await fetch(url, { headers, cache: 'no-store' });
    if (response.ok) {
        const data = await response.json();
        return data.sha;
    }
    if (response.status === 404) {
        return null; // File doesn't exist, which is fine for creation
    }
    // For other errors, throw
    const errorData = await response.json();
    throw new Error(`GitHub API Error (${response.status}): ${errorData.message || 'Could not fetch file metadata.'}`);
}

export default async function POST(request: Request) {
    try {
        const { settings, data } = await request.json();
        const { githubOwner, githubRepo, githubPath, githubPat } = settings;

        if (!githubOwner || !githubRepo || !githubPath || !githubPat) {
            return new Response(JSON.stringify({ error: 'Missing GitHub configuration parameters.' }), {
                status: 400,
                headers: RESPONSE_HEADERS,
            });
        }
        
        const contentUrl = `https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${githubPath}`;
        const headers = {
            'Authorization': `token ${githubPat}`,
            'Accept': 'application/vnd.github.v3+json',
            'X-GitHub-Api-Version': '2022-11-28'
        };

        const fileContent = JSON.stringify(data, null, 2);
        const contentBase64 = Buffer.from(fileContent).toString('base64');

        const sha = await getFileSha(contentUrl, headers);

        const body = {
            message: `feat: Update application data [via Admin Panel]`,
            content: contentBase64,
            sha: sha, // Include SHA if updating, otherwise it's null
        };

        const response = await fetch(contentUrl, {
            method: 'PUT',
            headers,
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('GitHub Contents API PUT error:', errorData);
            const errorMessage = `GitHub API Error (${response.status}): ${errorData.message || 'Failed to publish file.'}`;
            return new Response(JSON.stringify({ error: errorMessage }), {
                status: response.status,
                headers: RESPONSE_HEADERS,
            });
        }

        const responseData = await response.json();
        return new Response(JSON.stringify({ 
            success: true, 
            message: `Successfully published to commit ${responseData.commit.sha.substring(0, 7)}`,
        }), {
            status: 200,
            headers: RESPONSE_HEADERS,
        });

    } catch (error: any) {
        console.error('Error in GitHub publish proxy:', error);
        return new Response(JSON.stringify({ error: 'An internal server error occurred.', details: error.message }), {
            status: 500,
            headers: RESPONSE_HEADERS,
        });
    }
}

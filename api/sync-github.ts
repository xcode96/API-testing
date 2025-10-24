import { AppData } from '../services/api';

export const config = {
  runtime: 'edge',
  maxDuration: 60,
};

// Helper to encode string to Base64 for the Edge runtime.
// The btoa function may not handle multi-byte characters correctly on its own.
// This is a common workaround to properly encode Unicode strings before Base64 encoding.
const toBase64 = (str: string) => btoa(unescape(encodeURIComponent(str)));

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const data: AppData = await request.json();
    const { settings } = data;
    const { githubOwner, githubRepo, githubPath, githubPat } = settings;

    if (!githubOwner || !githubRepo || !githubPath || !githubPat) {
      return new Response(JSON.stringify({ success: false, error: 'GitHub configuration is incomplete.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const apiUrl = `https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${githubPath}`;
    
    // 1. Get the current file to get its SHA
    let currentSha: string | undefined;
    try {
        const getFileResponse = await fetch(apiUrl, {
            headers: {
                'Authorization': `token ${githubPat}`,
                'Accept': 'application/vnd.github.v3+json',
                'X-GitHub-Api-Version': '2022-11-28'
            },
        });

        if (getFileResponse.ok) {
            const fileData = await getFileResponse.json();
            currentSha = fileData.sha;
        } else if (getFileResponse.status !== 404) {
            const errorBody = await getFileResponse.text();
            throw new Error(`Failed to get file from GitHub: ${getFileResponse.status} ${errorBody}`);
        }
    } catch (e: any) {
        console.error("Error fetching from GitHub:", e);
        if (e.message.includes('Failed to get file')) throw e;
        throw new Error('Could not connect to GitHub. Check repository settings and PAT permissions.');
    }

    // 2. Prepare the new content
    const { githubPat: _, ...settingsToSave } = settings;
    const contentToSave: AppData = { ...data, settings: settingsToSave };
    const contentBase64 = toBase64(JSON.stringify(contentToSave, null, 2));
    
    // 3. Create or update the file
    const updateBody = {
      message: `[Automated] Sync training data ${new Date().toISOString()}`,
      content: contentBase64,
      sha: currentSha,
      committer: {
          name: "Cyber Training App Bot",
          email: "bot@training-app.com"
      }
    };

    const updateFileResponse = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${githubPat}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      body: JSON.stringify(updateBody),
    });

    if (!updateFileResponse.ok) {
        const errorBody = await updateFileResponse.json();
        throw new Error(`Failed to update file on GitHub: ${updateFileResponse.status} ${errorBody.message}`);
    }

    return new Response(JSON.stringify({ success: true, message: 'Sync successful.' }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (error: any) {
    console.error('GitHub Sync Error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message || 'An unknown error occurred.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
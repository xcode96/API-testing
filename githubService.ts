import { AppData } from './api';

// SECURITY WARNING: Hardcoding a Personal Access Token (PAT) in client-side code is extremely dangerous.
// Anyone can view the source code and steal this token, gaining access to your GitHub repositories.
// This should be handled by a secure backend service in a real-world application.
const GITHUB_PAT = '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';
const GITHUB_OWNER = 'xcode96';
const GITHUB_REPO = 'API-testing';
const FILE_PATH = 'training-data.json'; // The file to be updated in the repository.
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`;

// Helper to Base64 encode string content for the GitHub API
const encodeContent = (content: string): string => {
    // btoa is a built-in browser function for Base64 encoding
    // The unescape/encodeURIComponent is a common trick to handle UTF-8 characters correctly.
    return btoa(unescape(encodeURIComponent(content)));
};

// Function to get the current SHA of the file, which is required for updates.
const getFileSha = async (): Promise<string | undefined> => {
    try {
        const response = await fetch(GITHUB_API_URL, {
            method: 'GET',
            headers: {
                'Authorization': `token ${GITHUB_PAT}`,
                'Accept': 'application/vnd.github.v3+json',
            },
        });
        if (response.ok) {
            const data = await response.json();
            return data.sha;
        }
        if (response.status === 404) {
            // File doesn't exist yet, which is fine. We'll create it.
            return undefined;
        }
        // Handle other errors
        console.error('GitHub API error (getFileSha):', response.status, await response.text());
        return undefined;
    } catch (error) {
        console.error('Failed to fetch file SHA from GitHub:', error);
        return undefined;
    }
};

/**
 * Syncs the entire application data state to a JSON file in a GitHub repository.
 * It will create the file if it doesn't exist, or update it if it does.
 * @param data The complete application data object to be saved.
 */
export const syncToGithub = async (data: AppData) => {
    console.log("Attempting to sync data to GitHub...");

    const fileSha = await getFileSha();

    const contentToSave = JSON.stringify(data, null, 2);
    const encodedContent = encodeContent(contentToSave);

    const commitMessage = `Automated data sync on training completion: ${new Date().toISOString()}`;

    const payload: { message: string; content: string; sha?: string } = {
        message: commitMessage,
        content: encodedContent,
    };

    // If we are updating a file, we must include its SHA.
    if (fileSha) {
        payload.sha = fileSha;
    }

    try {
        const response = await fetch(GITHUB_API_URL, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${GITHUB_PAT}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Successfully synced data to GitHub:', result.commit.sha);
            alert('Training data has been successfully synced to the GitHub repository.');
        } else {
            const errorText = await response.text();
            console.error('GitHub API error (syncToGithub):', response.status, errorText);
            alert(`Failed to sync data to GitHub. Status: ${response.status}. Please check the console for details.`);
        }
    } catch (error) {
        console.error('Failed to sync data to GitHub:', error);
        alert('An error occurred while syncing data to GitHub. Please check the console for details.');
    }
};

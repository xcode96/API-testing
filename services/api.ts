import { Quiz, User, Email, AppSettings } from '../types';
import { INITIAL_QUIZZES } from '../quizzes';

export interface AppData {
    users: User[];
    quizzes: Quiz[];
    emailLog: Email[];
    settings: AppSettings;
}

// --- Start: Duplicated initial data from api/data.ts for fallback ---
const initialUsers: User[] = [
  { id: 1, fullName: 'Demo User', username: 'demo', password: 'demo', trainingStatus: 'not-started', lastScore: null, role: 'user', assignedExams: ['it_security_policy', 'hr_exam'], answers: [], moduleProgress: {} },
  { id: 2, fullName: 'Dev Lead', username: 'dev', password: 'dev', trainingStatus: 'not-started', lastScore: null, role: 'user', assignedExams: ['it_security_policy', 'it_developer_policy'], answers: [], moduleProgress: {} },
  { id: 3, fullName: 'Sys Admin', username: 'server', password: 'server', trainingStatus: 'not-started', lastScore: null, role: 'user', assignedExams: ['it_security_policy', 'server_exam', 'it_policy_exam', 'operation_exam'], answers: [], moduleProgress: {} },
  { id: 4, fullName: 'IT Support', username: 'it', password: 'it', trainingStatus: 'not-started', lastScore: null, role: 'user', assignedExams: ['it_security_policy', 'it_policy_exam'], answers: [], moduleProgress: {} },
  { id: 999, fullName: 'Default Admin', username: 'admin', password: 'admin', trainingStatus: 'not-started', lastScore: null, role: 'admin', answers: [], moduleProgress: {} },
];

const defaultSettings: AppSettings = {
  logo: null,
  companyFullName: 'Cyber Security Training Consortium',
  signature1: null,
  signature1Name: 'Dan Houser',
  signature1Title: 'Chairperson',
  signature2: null,
  signature2Name: 'Laurie-Anne Bourdain',
  signature2Title: 'Secretary',
  courseName: 'Certified Cyber Security Professional',
  certificationBodyText: 'Having met all of the certification requirements, adoption of the Code of Ethics, and successful performance on the required competency examination, subject to recertification every three years, this individual is entitled to all of the rights and privileges associated with this designation.',
  certificationSeal: null,
  certificationCycleYears: 3,
};

const getInitialData = (): AppData => ({
    users: initialUsers,
    quizzes: INITIAL_QUIZZES,
    emailLog: [],
    settings: defaultSettings,
});
// --- End: Duplicated initial data ---

const LOCAL_STORAGE_KEY = 'cyber-security-training-data-local-backup';

export const fetchData = async (): Promise<AppData> => {
    try {
        const response = await fetch('/api/data');
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        const serverData = await response.json();
        // Sync server data to local storage for offline use/backup
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(serverData));
        return serverData;
    } catch (error) {
        console.warn(
            'API fetch failed. This is expected in a local environment without a running Vercel dev server. Falling back to local storage.',
            error
        );

        const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localData) {
            try {
                return JSON.parse(localData);
            } catch (e) {
                console.error('Failed to parse local storage data, returning initial data.', e);
                // Fall through to return initial data
            }
        }
        
        return getInitialData();
    }
};

export const saveData = async (data: AppData): Promise<void> => {
    // Always save to local storage immediately for responsiveness and offline capability.
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.error("Failed to save data to local storage", e);
    }
    
    // Attempt to save to the server in the background.
    try {
        const response = await fetch('/api/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            // Log server-side error but don't throw, as local save succeeded.
             const errorText = await response.text();
             console.error('Failed to save data to the server:', response.status, errorText);
        }
    } catch (error) {
        console.warn(
            'API save failed. Data is saved locally. This is expected in a local environment without a running Vercel dev server.',
            error
        );
    }
};

// --- GITHUB SYNC LOGIC ---

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

    const commitMessage = `Automated data sync: ${new Date().toISOString()}`;

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

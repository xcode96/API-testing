

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
  { id: 1, fullName: 'Demo User', username: 'demo', password: 'demo', trainingStatus: 'not-started', lastScore: null, role: 'user', assignedExams: ['it_security_policy', 'hr_exam', 'it_policy_exam', 'server_exam', 'operation_exam', 'legal_exam', 'data_analyst_exam', 'it_developer_policy'], answers: [], moduleProgress: {} },
  { id: 2, fullName: 'Dev Lead', username: 'dev', password: 'dev', trainingStatus: 'not-started', lastScore: null, role: 'user', assignedExams: ['it_security_policy', 'it_developer_policy'], answers: [], moduleProgress: {} },
  { id: 3, fullName: 'Sys Admin', username: 'server', password: 'server', trainingStatus: 'not-started', lastScore: null, role: 'user', assignedExams: ['it_security_policy', 'server_exam', 'it_policy_exam', 'operation_exam'], answers: [], moduleProgress: {} },
  { id: 4, fullName: 'IT Support', username: 'it', password: 'it', trainingStatus: 'not-started', lastScore: null, role: 'user', assignedExams: ['it_security_policy', 'it_policy_exam'], answers: [], moduleProgress: {} },
  { id: 5, fullName: 'Data Analyst', username: 'analyst', password: 'analyst', trainingStatus: 'not-started', lastScore: null, role: 'user', assignedExams: ['it_security_policy', 'data_analyst_exam'], answers: [], moduleProgress: {} },
  { id: 999, fullName: 'Default Admin', username: 'admin', password: 'dqadm', trainingStatus: 'not-started', lastScore: null, role: 'admin', answers: [], moduleProgress: {} },
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
const GITHUB_SETTINGS_KEY = 'github-publish-settings';


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

/**
 * Helper to Base64 encode string content for the GitHub API.
 * In a browser environment, btoa is standard. We use a trick to handle UTF-8 characters.
 */
const encodeContent = (content: string): string => {
    return btoa(unescape(encodeURIComponent(content)));
};

/**
 * Gets the current SHA of the file from GitHub, required for updates.
 */
const getFileSha = async (owner: string, repo: string, path: string, token: string): Promise<string | undefined> => {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
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

/**
 * Triggers a client-side sync of application data to a user-configured GitHub repository.
 * The settings (repo, owner, token, etc.) are pulled from localStorage.
 * @param data The complete application data object to be saved.
 * @returns A promise that resolves to an object indicating success or failure.
 */
export const triggerGithubSync = async (data: AppData): Promise<{ success: boolean; error?: string }> => {
    const settingsStr = localStorage.getItem(GITHUB_SETTINGS_KEY);

    // Silently skip sync if settings are not configured. This is an optional feature.
    if (!settingsStr) {
        console.log("GitHub sync skipped: settings not configured.");
        return { success: true }; // Return success to avoid console errors from the calling useEffect
    }

    const { owner, repo, path, token } = JSON.parse(settingsStr);

    // Silently skip if settings are incomplete.
    if (!owner || !repo || !path || !token) {
        console.error('GitHub sync skipped: settings are incomplete.');
        return { success: true }; // Return success to avoid console errors
    }

    console.log("Attempting to trigger client-side GitHub sync...");

    try {
        const fileSha = await getFileSha(owner, repo, path, token);
        const contentToSave = JSON.stringify(data, null, 2);
        const encodedContent = encodeContent(contentToSave);
        const commitMessage = `Automated data sync: ${new Date().toISOString()}`;
        
        const payload: { message: string; content: string; sha?: string } = {
            message: commitMessage,
            content: encodedContent,
        };
        if (fileSha) {
            payload.sha = fileSha;
        }

        const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Successfully synced data to GitHub:', result.commit.sha);
            // No alert on success for a better UX with automatic sync.
            return { success: true };
        } else {
            const errorData = await response.json();
            const errorMessage = errorData.message || 'An unknown error occurred.';
            console.error('Failed to sync data to GitHub:', response.status, errorMessage);
            // Alert user on actual error so they can fix their config.
            alert(`Failed to publish data to GitHub. Status: ${response.status}.\n\nError: ${errorMessage}\n\nPlease check your settings and Personal Access Token.`);
            return { success: false, error: errorMessage };
        }
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred.';
        console.error('Failed to trigger GitHub sync:', error);
        // Alert user on network/other errors.
        alert(`An error occurred while trying to publish data to GitHub. Please check the browser console.`);
        return { success: false, error: errorMessage };
    }
};
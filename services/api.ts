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
  { id: 5, fullName: 'Data Analyst', username: 'analyst', password: 'analyst', trainingStatus: 'not-started', lastScore: null, role: 'user', assignedExams: ['it_security_policy', 'data_analyst_exam'], answers: [], moduleProgress: {} },
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

/**
 * Triggers a server-side function to sync the application data to GitHub.
 * This is more secure as the PAT is not exposed on the client.
 * @param data The complete application data object to be saved.
 */
export const triggerGithubSync = async (data: AppData) => {
    console.log("Attempting to trigger GitHub sync...");
    try {
        const response = await fetch('/api/sync-github', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Successfully triggered GitHub sync. Commit:', result.commit);
            alert('Training data has been successfully synced to the GitHub repository.');
        } else {
            const errorData = await response.json();
            console.error('Failed to sync data to GitHub:', response.status, errorData.error);
            const troubleshootingMessage = `\n\nTroubleshooting steps:\n1. Ensure the 'GITHUB_PAT' environment variable is set correctly in your Vercel project settings.\n2. Verify the Personal Access Token has 'repo' scope permissions.\n3. Check the Vercel deployment logs for more details.`;
            alert(`Failed to sync data to GitHub. Status: ${response.status}.\nError: ${errorData.error}${troubleshootingMessage}`);
        }
    } catch (error) {
        console.error('Failed to trigger GitHub sync:', error);
        alert('An error occurred while trying to sync data to GitHub. Please check the browser console and server logs for details.');
    }
};
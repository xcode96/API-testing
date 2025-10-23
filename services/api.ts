import { Quiz, User, Email, AppSettings, ModuleCategory } from '../types';
import { INITIAL_QUIZZES } from '../quizzes';
import { Buffer } from 'buffer';

export interface AppData {
    users: User[];
    quizzes: Quiz[];
    emailLog: Email[];
    settings: AppSettings;
    moduleCategories?: ModuleCategory[];
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
  githubOwner: 'xcode96',
  githubRepo: 'API-testing',
  githubPath: 'training-data.json',
  githubPat: '',
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

// --- GITHUB SYNC LOGIC (CLIENT-SIDE) ---

/**
 * Triggers a client-side sync of application data to the configured GitHub repository.
 * @param data The complete application data object to be saved.
 * @returns An object indicating success or failure.
 */
export const triggerGithubSync = async (data: AppData): Promise<{ success: boolean; error?: string }> => {
    const { settings } = data;
    const { githubOwner, githubRepo, githubPath, githubPat } = settings;

    if (!githubOwner || !githubRepo || !githubPath || !githubPat) {
        return { success: false, error: "GitHub sync settings are incomplete. Please configure all fields in Admin > Settings." };
    }

    const GITHUB_API_URL = `https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${githubPath}`;

    try {
        // Step 1: Get the current SHA of the file to perform an update.
        let sha: string | undefined;
        const getResponse = await fetch(GITHUB_API_URL, {
            headers: {
                'Authorization': `token ${githubPat}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Cyber-Training-Dashboard-Sync'
            },
        });

        if (getResponse.ok) {
            const fileData = await getResponse.json();
            sha = fileData.sha;
        } else if (getResponse.status !== 404) {
            // A 404 means the file doesn't exist, which is fine (we'll create it).
            // Any other error is a problem (e.g., 401 Bad Credentials, 403 Forbidden).
            const errorData = await getResponse.json().catch(() => ({ message: 'Could not parse GitHub error response.' }));
            throw new Error(`GitHub API Error (${getResponse.status}): ${errorData.message || 'Could not retrieve file information. Check repository path and token permissions.'}`);
        }

        // Step 2: Prepare the content and create/update the file.
        // IMPORTANT: Create a deep copy of the data and remove the PAT before syncing to avoid leaking secrets.
        const dataToSync = JSON.parse(JSON.stringify(data));
        if (dataToSync.settings && dataToSync.settings.githubPat) {
            delete dataToSync.settings.githubPat;
        }

        const contentToSave = JSON.stringify(dataToSync, null, 2);
        const encodedContent = Buffer.from(contentToSave, 'utf-8').toString('base64');

        const payload = {
            message: `Automated data sync: ${new Date().toISOString()}`,
            content: encodedContent,
            sha: sha, // Include SHA if it's an update, otherwise it's undefined for creation.
        };

        const putResponse = await fetch(GITHUB_API_URL, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${githubPat}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
                'User-Agent': 'Cyber-Training-Dashboard-Sync'
            },
            body: JSON.stringify(payload),
        });

        if (putResponse.ok) {
            console.log('Successfully synced data to GitHub.');
            return { success: true };
        } else {
            const errorData = await putResponse.json().catch(() => ({ message: 'Could not parse GitHub error response.' }));
            throw new Error(`GitHub API Error (${putResponse.status}): ${errorData.message || 'Failed to save file to repository.'}`);
        }
    } catch (error: any) {
        console.error("Client-side GitHub Sync Error:", error);
        return { success: false, error: error.message || 'A network error occurred during sync.' };
    }
};
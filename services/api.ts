import { Quiz, User, Email, AppSettings, ModuleCategory } from '../types';
import { INITIAL_QUIZZES } from '../quizzes';

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

// --- GitHub API Helpers ---

// FIX: Refactored GitHubFetchResult to a single interface to resolve type-checking issues.
// This simplifies handling API responses and fixes cascading compilation errors.
interface GitHubFetchResult {
    success: boolean;
    data?: AppData;
    error?: string;
}


const getGitHubHeaders = (pat: string) => ({
    'Authorization': `token ${pat}`,
    'Accept': 'application/vnd.github.v3+json',
});

export const fetchFromGitHub = async (settings: AppSettings): Promise<GitHubFetchResult> => {
    const { githubOwner, githubRepo, githubPath, githubPat } = settings;
    if (!githubOwner || !githubRepo || !githubPath || !githubPat) {
        return { success: false, error: "GitHub sync settings are incomplete." };
    }

    const url = `https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${githubPath}`;

    try {
        const response = await fetch(url, { 
            headers: getGitHubHeaders(githubPat),
            cache: 'no-store'
        });

        if (!response.ok) {
            switch (response.status) {
                case 401:
                case 403:
                    return { success: false, error: 'Authentication failed. Please check your Personal Access Token and its permissions (repo > contents: read/write).' };
                case 404:
                    return { success: false, error: 'File not found. Please check the Owner, Repo Name, and File Path.' };
                default:
                    const errorBody = await response.text();
                    console.error("GitHub API fetch error:", errorBody);
                    return { success: false, error: `An unexpected error occurred: ${response.status} ${response.statusText}.` };
            }
        }
        
        const content = await response.json();
        if (content.content) {
            const decodedContent = atob(content.content);
            const data = JSON.parse(decodedContent);
            console.log("Successfully fetched data from GitHub.");
            return { success: true, data: data as AppData };
        }
        return { success: false, error: 'Connection successful, but file appears empty or is a directory.' };
    } catch (error) {
        console.error("Error fetching data from GitHub:", error);
        return { success: false, error: 'Network error. Could not reach GitHub API. Check internet connection or console for CORS issues.' };
    }
};

const saveToGitHub = async (data: AppData): Promise<void> => {
    const { settings } = data;
    const { githubOwner, githubRepo, githubPath, githubPat } = settings;

    if (!githubOwner || !githubRepo || !githubPath || !githubPat) {
        return; // Not configured
    }

    const url = `https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${githubPath}`;

    try {
        // 1. Get current file SHA
        let currentSha: string | undefined;
        try {
            const getResponse = await fetch(url, { headers: getGitHubHeaders(githubPat), cache: 'no-store' });
            if (getResponse.ok) {
                const fileData = await getResponse.json();
                currentSha = fileData.sha;
            } else if (getResponse.status !== 404) {
                throw new Error(`Failed to get current file SHA: ${getResponse.status}`);
            }
        } catch (e) {
            console.warn("Could not get current file from GitHub. Will attempt to create a new one.", e);
        }

        // 2. Prepare content for update/creation
        const contentToSave = JSON.stringify(data, null, 2);
        const encodedContent = btoa(contentToSave);

        const body: { message: string, content: string, sha?: string } = {
            message: `[Automated] Update training data from Cyber Security Dashboard`,
            content: encodedContent,
        };
        if (currentSha) {
            body.sha = currentSha;
        }
        
        // 3. PUT request to update/create file
        const putResponse = await fetch(url, {
            method: 'PUT',
            headers: {
                ...getGitHubHeaders(githubPat),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!putResponse.ok) {
            const errorBody = await putResponse.json();
            throw new Error(`GitHub API save failed: ${putResponse.status} - ${errorBody.message}`);
        }

        console.log("Successfully saved data to GitHub.");

    } catch (error) {
        console.error("Error saving data to GitHub:", error);
    }
};

// --- Main Data Functions ---

export const fetchData = async (): Promise<AppData> => {
    let kvData: AppData | null = null;
    try {
        const response = await fetch('/api/data', { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`API failed with status: ${response.status}`);
        }
        kvData = await response.json() as AppData;
        
        if (kvData?.settings) {
            const githubResult = await fetchFromGitHub(kvData.settings);
            if (githubResult.success) {
                const githubData = githubResult.data;
                // Sync-back to KV if data differs
                if (githubData && JSON.stringify(githubData) !== JSON.stringify(kvData)) {
                    console.log("GitHub data differs from backend. Syncing back...");
                    // Fire-and-forget update to backend.
                    fetch('/api/update', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(githubData),
                    }).catch(err => console.warn("Sync-back to KV failed:", err));
                }
                if (githubData) {
                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(githubData));
                    return githubData;
                }
            }
        }
        
        if (kvData) {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(kvData));
            return kvData;
        }

    } catch (error) {
        console.warn('API fetch failed, trying local storage.', error);
    }
    
    const localDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (localDataString) {
        try {
            return JSON.parse(localDataString) as AppData;
        } catch (e) {
            console.error('Failed to parse local storage data.', e);
        }
    }
    
    console.log("No valid data source found, returning initial data.");
    const initialData = getInitialData();
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
};

export const saveData = async (data: AppData): Promise<void> => {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.error("Failed to save data to local storage", e);
    }
    
    fetch('/api/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).catch(error => {
        console.warn(
            'API save failed (KV). Data is saved locally.',
            error
        );
    });

    saveToGitHub(data);
};

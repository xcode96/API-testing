import { Quiz, User, ModuleCategory, AppSettings } from '../types';
import { INITIAL_QUIZZES } from '../quizzes';

export interface AppData {
    users: User[];
    quizzes: Quiz[];
    moduleCategories?: ModuleCategory[];
    // FIX: Add settings to AppData interface
    settings?: AppSettings;
}

// FIX: Add initial settings for client-side fallback
const initialSettings: AppSettings = {
    companyFullName: "Cyberdyne Systems",
    courseName: "Cyber Security Awareness",
    certificationBodyText: "This certifies that the individual has successfully completed all modules and requirements for the Cyber Security Awareness training program, demonstrating proficiency in key security principles and practices.",
    certificationCycleYears: 3,
    githubOwner: '',
    githubRepo: '',
    githubPath: '',
    githubPat: ''
};


// --- Start: Duplicated initial data from api/data.ts for fallback ---
const initialUsers: User[] = [
  { id: 1, fullName: 'Demo User', username: 'demo', password: 'demo', trainingStatus: 'not-started', lastScore: null, role: 'user', assignedExams: ['it_security_policy', 'hr_exam', 'it_policy_exam', 'server_exam', 'operation_exam', 'legal_exam', 'data_analyst_exam', 'it_developer_policy', 'finance_policy_exam'], answers: [], moduleProgress: {} },
  { id: 2, fullName: 'Dev Lead', username: 'dev', password: 'dev', trainingStatus: 'not-started', lastScore: null, role: 'user', assignedExams: ['it_security_policy', 'it_developer_policy'], answers: [], moduleProgress: {} },
  { id: 3, fullName: 'Sys Admin', username: 'server', password: 'server', trainingStatus: 'not-started', lastScore: null, role: 'user', assignedExams: ['it_security_policy', 'server_exam', 'it_policy_exam', 'operation_exam'], answers: [], moduleProgress: {} },
  { id: 4, fullName: 'IT Support', username: 'it', password: 'it', trainingStatus: 'not-started', lastScore: null, role: 'user', assignedExams: ['it_security_policy', 'it_policy_exam'], answers: [], moduleProgress: {} },
  { id: 5, fullName: 'Data Analyst', username: 'analyst', password: 'analyst', trainingStatus: 'not-started', lastScore: null, role: 'user', assignedExams: ['it_security_policy', 'data_analyst_exam'], answers: [], moduleProgress: {} },
  { id: 999, fullName: 'Default Admin', username: 'admin', password: 'dqadm', trainingStatus: 'not-started', lastScore: null, role: 'admin', answers: [], moduleProgress: {} },
];

const getInitialData = (): AppData => ({
    users: initialUsers,
    quizzes: INITIAL_QUIZZES,
    settings: initialSettings,
});
// --- End: Duplicated initial data ---

const LOCAL_STORAGE_KEY = 'cyber-security-training-data-local-backup';

// --- Main Data Functions ---

// FIX: Implement and export fetchFromGitHub to resolve import error in SettingsPanel.
interface GitHubParams {
    owner: string;
    repo: string;
    path: string;
    pat: string;
}

export const fetchFromGitHub = async (params: GitHubParams): Promise<any> => {
    const response = await fetch('/api/github-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `GitHub proxy failed with status ${response.status}`);
    }
    return response.json();
};

export const fetchData = async (): Promise<AppData> => {
    try {
        const response = await fetch('/api/data', { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`API failed with status: ${response.status}`);
        }
        const kvData = await response.json() as AppData;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(kvData));
        return kvData;
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
    // Always save to local storage as a backup
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.error("Failed to save data to local storage", e);
    }

    // Attempt to save to the persistent backend in chunks to avoid payload size limits.
    try {
        // FIX: Include settings when saving data.
        const dataParts: Record<string, any> = {
            users: data.users,
            quizzes: data.quizzes,
            moduleCategories: data.moduleCategories || [],
        };
        if (data.settings) {
            dataParts.settings = data.settings;
        }

        const savePromises = Object.entries(dataParts).map(([key, value]) =>
            savePartialData(key, value)
        );

        await Promise.all(savePromises);

    } catch (error) {
        console.error('API save failed (KV). Data is saved locally but not permanently.', error);
        // Re-throw the error so the caller knows it failed.
        throw error;
    }
};

export const savePartialData = async (key: string, value: any): Promise<void> => {
    try {
        const response = await fetch('/api/update-partial', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key, value }),
        });
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Server partial save failed for key '${key}' with status ${response.status}: ${errorBody}`);
        }
    } catch (error) {
        console.error(`API partial save failed for key '${key}'.`, error);
        throw error;
    }
};

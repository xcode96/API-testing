
import { Quiz, User, ModuleCategory, AppSettings } from '../types';
import { INITIAL_QUIZZES } from '../quizzes';
import { INITIAL_MODULE_CATEGORIES } from '../constants';

export interface AppData {
    users: User[];
    quizzes: Quiz[];
    moduleCategories: ModuleCategory[];
    settings: AppSettings;
}

// --- Start: Duplicated initial data for complete fallback ---
const initialUsers: User[] = [
  { id: 1, fullName: 'Demo User', username: 'demo', password: 'demo', trainingStatus: 'not-started', lastScore: null, role: 'user', assignedExams: ['it_security_policy', 'hr_exam', 'it_policy_exam', 'server_exam', 'operation_exam', 'legal_exam', 'data_analyst_exam', 'it_developer_policy', 'finance_policy_exam'], answers: [], moduleProgress: {} },
  { id: 2, fullName: 'Dev Lead', username: 'dev', password: 'dev', trainingStatus: 'not-started', lastScore: null, role: 'user', assignedExams: ['it_security_policy', 'it_developer_policy'], answers: [], moduleProgress: {} },
  { id: 3, fullName: 'Sys Admin', username: 'server', password: 'server', trainingStatus: 'not-started', lastScore: null, role: 'user', assignedExams: ['it_security_policy', 'server_exam', 'it_policy_exam', 'operation_exam'], answers: [], moduleProgress: {} },
  { id: 4, fullName: 'IT Support', username: 'it', password: 'it', trainingStatus: 'not-started', lastScore: null, role: 'user', assignedExams: ['it_security_policy', 'it_policy_exam'], answers: [], moduleProgress: {} },
  { id: 5, fullName: 'Data Analyst', username: 'analyst', password: 'analyst', trainingStatus: 'not-started', lastScore: null, role: 'user', assignedExams: ['it_security_policy', 'data_analyst_exam'], answers: [], moduleProgress: {} },
  { id: 999, fullName: 'Default Admin', username: 'admin', password: 'dqadm', trainingStatus: 'not-started', lastScore: null, role: 'admin', assignedExams: [], answers: [], moduleProgress: {} },
];

const defaultSettings: AppSettings = {
    githubOwner: '',
    githubRepo: '',
    githubPath: 'data.json',
    githubPat: '',
};

const getInitialData = (): AppData => ({
    users: initialUsers,
    quizzes: INITIAL_QUIZZES,
    moduleCategories: INITIAL_MODULE_CATEGORIES,
    settings: defaultSettings,
});
// --- End: Duplicated initial data ---

const LOCAL_STORAGE_KEY = 'cyber-security-training-data-local-backup';

const ensureCompleteData = (data: Partial<AppData> | null): AppData => {
    const defaults = getInitialData();
    if (!data) return defaults;
    return {
        users: data.users && data.users.length > 0 ? data.users : defaults.users,
        quizzes: data.quizzes && data.quizzes.length > 0 ? data.quizzes : defaults.quizzes,
        moduleCategories: data.moduleCategories && data.moduleCategories.length > 0 ? data.moduleCategories : defaults.moduleCategories,
        settings: data.settings ? { ...defaults.settings, ...data.settings } : defaults.settings,
    };
};

// --- Main Data Functions ---

export const fetchData = async (): Promise<AppData> => {
    let loadedData: Partial<AppData> | null = null;
    try {
        const response = await fetch('/api/data', { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`API failed with status: ${response.status}`);
        }
        loadedData = await response.json() as Partial<AppData>;
    } catch (error) {
        console.warn('API fetch failed, trying local storage.', error);
        const localDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localDataString) {
            try {
                loadedData = JSON.parse(localDataString) as Partial<AppData>;
            } catch (e) {
                console.error('Failed to parse local storage data.', e);
                loadedData = null;
            }
        }
    }
    
    const completeData = ensureCompleteData(loadedData);
    
    // Always update local storage with the complete, sanitized data to prevent future issues.
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(completeData));
    
    return completeData;
};

export const saveData = async (data: AppData): Promise<void> => {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.error("Failed to save data to local storage", e);
    }

    try {
        const dataParts: Record<string, any> = {
            users: data.users,
            quizzes: data.quizzes,
            moduleCategories: data.moduleCategories || [],
            settings: data.settings || {},
        };

        const savePromises = Object.entries(dataParts).map(([key, value]) =>
            savePartialData(key, value)
        );

        await Promise.all(savePromises);

    } catch (error) {
        console.error('API save failed (KV). Data is saved locally but not permanently.', error);
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

interface PublishParams {
  settings: AppSettings;
  data: AppData;
}

export const publishToGitHub = async ({ settings, data }: PublishParams): Promise<{ success: boolean; message: string }> => {
  const response = await fetch('/api/publish-github', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ settings, data }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || `Failed to publish to GitHub. Status: ${response.status}`);
  }
  return result;
};

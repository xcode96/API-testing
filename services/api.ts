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

export const fetchData = async (): Promise<AppData> => {
    try {
        const response = await fetch('/api/data');
        if (!response.ok) {
            throw new Error(`API failed with status: ${response.status}`);
        }
        const apiData = await response.json() as AppData;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(apiData));
        return apiData;

    } catch (error) {
        console.warn('API fetch failed, trying local storage.', error);
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

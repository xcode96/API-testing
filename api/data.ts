import { kv, LEGACY_DATA_KEY, KEY_USERS, KEY_QUIZZES, KEY_MODULE_CATEGORIES, KEY_SETTINGS } from './db';
import { Quiz, User, AppSettings } from '../types';
import { INITIAL_QUIZZES } from '../quizzes';

export const maxDuration = 60; // Increase timeout to 60 seconds

const initialUsers: User[] = [
  { id: 1, fullName: 'Demo User', username: 'demo', password: 'demo', trainingStatus: 'not-started', lastScore: null, role: 'user', assignedExams: ['it_security_policy', 'hr_exam', 'it_policy_exam', 'server_exam', 'operation_exam', 'legal_exam', 'data_analyst_exam', 'it_developer_policy', 'finance_policy_exam'], answers: [], moduleProgress: {} },
  { id: 2, fullName: 'Dev Lead', username: 'dev', password: 'dev', trainingStatus: 'not-started', lastScore: null, role: 'user', assignedExams: ['it_security_policy', 'it_developer_policy'], answers: [], moduleProgress: {} },
  { id: 3, fullName: 'Sys Admin', username: 'server', password: 'server', trainingStatus: 'not-started', lastScore: null, role: 'user', assignedExams: ['it_security_policy', 'server_exam', 'it_policy_exam', 'operation_exam'], answers: [], moduleProgress: {} },
  { id: 4, fullName: 'IT Support', username: 'it', password: 'it', trainingStatus: 'not-started', lastScore: null, role: 'user', assignedExams: ['it_security_policy', 'it_policy_exam'], answers: [], moduleProgress: {} },
  { id: 5, fullName: 'Data Analyst', username: 'analyst', password: 'analyst', trainingStatus: 'not-started', lastScore: null, role: 'user', assignedExams: ['it_security_policy', 'data_analyst_exam'], answers: [], moduleProgress: {} },
  { id: 999, fullName: 'Default Admin', username: 'admin', password: 'dqadm', trainingStatus: 'not-started', lastScore: null, role: 'admin', answers: [], moduleProgress: {} },
];

// FIX: Define initial settings for server-side initialization
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

const getInitialData = () => ({
    users: initialUsers,
    quizzes: INITIAL_QUIZZES,
    // FIX: Include settings in initial data
    settings: initialSettings,
});


async function initializeAndSaveData() {
    if (!kv) return getInitialData();
    const initialData = getInitialData();
    const tx = kv.multi();
    tx.set(KEY_USERS, initialData.users);
    tx.set(KEY_QUIZZES, initialData.quizzes);
    // FIX: Save initial settings to KV store
    tx.set(KEY_SETTINGS, initialData.settings);
    await tx.exec();
    return initialData;
}


export default async function GET(request: Request) {
  if (!kv) {
     return new Response(JSON.stringify({ error: 'KV store is not configured.' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }

  try {
    // 1. Check for legacy data and migrate if found
    const legacyData = await kv.get(LEGACY_DATA_KEY);
    if (legacyData && typeof legacyData === 'object' && 'users' in legacyData) {
        console.log('Found legacy data, migrating to multi-key structure...');
        const data = legacyData as any; // Cast for simplicity
        const tx = kv.multi();
        tx.set(KEY_USERS, data.users);
        tx.set(KEY_QUIZZES, data.quizzes);
        if (data.moduleCategories) {
            tx.set(KEY_MODULE_CATEGORIES, data.moduleCategories);
        }
        // FIX: Migrate settings if they exist
        if (data.settings) {
            tx.set(KEY_SETTINGS, data.settings);
        }
        tx.del(LEGACY_DATA_KEY);
        await tx.exec();
        console.log('Migration complete.');
        
        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        });
    }

    // 2. Fetch data using the new multi-key structure
    // FIX: Fetch settings along with other data
    const [users, quizzes, moduleCategories, settings] = await kv.mget(
        KEY_USERS,
        KEY_QUIZZES,
        KEY_MODULE_CATEGORIES,
        KEY_SETTINGS
    );

    // 3. If no data found, initialize it
    if (!users || !quizzes) {
        console.log('No data found in KV, initializing with default data.');
        const initialData = await initializeAndSaveData();
        return new Response(JSON.stringify(initialData), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        });
    }
    
    // 4. Assemble and return the data
    // FIX: Include settings in the response, with a fallback
    const data = {
        users,
        quizzes,
        moduleCategories: moduleCategories || [], // Ensure it's an array
        settings: settings || initialSettings,
    };
    
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Failed to fetch data from KV:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}

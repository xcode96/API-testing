import { kv, LEGACY_DATA_KEY, KEY_USERS, KEY_QUIZZES, KEY_EMAIL_LOG, KEY_SETTINGS, KEY_MODULE_CATEGORIES } from './db';
import { Quiz, User, AppSettings, Email } from '../types';
import { INITIAL_QUIZZES } from '../quizzes';

export const maxDuration = 60; // Increase timeout to 60 seconds

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
  githubOwner: '',
  githubRepo: '',
  githubPath: 'data.json',
  githubPat: '',
};

const getInitialData = () => ({
    users: initialUsers,
    quizzes: INITIAL_QUIZZES,
    emailLog: [],
    settings: defaultSettings,
});


async function initializeAndSaveData() {
    if (!kv) return getInitialData();
    const initialData = getInitialData();
    const tx = kv.multi();
    tx.set(KEY_USERS, initialData.users);
    tx.set(KEY_QUIZZES, initialData.quizzes);
    tx.set(KEY_EMAIL_LOG, initialData.emailLog);
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
        tx.set(KEY_EMAIL_LOG, data.emailLog || []);
        tx.set(KEY_SETTINGS, data.settings);
        if (data.moduleCategories) {
            tx.set(KEY_MODULE_CATEGORIES, data.moduleCategories);
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
    const [users, quizzes, emailLog, settings, moduleCategories] = await kv.mget(
        KEY_USERS,
        KEY_QUIZZES,
        KEY_EMAIL_LOG,
        KEY_SETTINGS,
        KEY_MODULE_CATEGORIES
    );

    // 3. If no data found, initialize it
    if (!users || !quizzes || !settings) {
        console.log('No data found in KV, initializing with default data.');
        const initialData = await initializeAndSaveData();
        return new Response(JSON.stringify(initialData), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        });
    }
    
    // 4. Assemble and return the data
    const data = {
        users,
        quizzes,
        emailLog: emailLog || [],
        settings,
        moduleCategories: moduleCategories || [], // Ensure it's an array
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

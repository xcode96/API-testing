import { kv, KEY_USERS, KEY_QUIZZES, KEY_EMAIL_LOG, KEY_SETTINGS, KEY_MODULE_CATEGORIES } from './db';

export const maxDuration = 60;

const VALID_KEYS: Record<string, string> = {
    users: KEY_USERS,
    quizzes: KEY_QUIZZES,
    emailLog: KEY_EMAIL_LOG,
    settings: KEY_SETTINGS,
    moduleCategories: KEY_MODULE_CATEGORIES,
};

export default async function POST(request: Request) {
   if (!kv) {
     return new Response(JSON.stringify({ error: 'KV store is not configured.' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
   }
  try {
    const body = await request.json();
    const { key, value } = body;

    const dbKey = VALID_KEYS[key];

    if (!dbKey) {
        return new Response(JSON.stringify({ error: `Invalid data key provided: ${key}` }), {
            headers: { 'Content-Type': 'application/json' },
            status: 400,
        });
    }
    
    await kv.set(dbKey, value);
    
    return new Response(JSON.stringify({ success: true, key }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error(`Failed to save partial data to KV:`, error);
    return new Response(JSON.stringify({ error: 'Failed to save partial data' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}

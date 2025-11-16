import { kv, KEY_USERS, KEY_QUIZZES, KEY_SETTINGS, KEY_MODULE_CATEGORIES } from './db';

export const maxDuration = 60; // Increase timeout to 60 seconds

export default async function POST(request: Request) {
   if (!kv) {
     return new Response(JSON.stringify({ error: 'KV store is not configured.' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
  try {
    const body = await request.json();
    
    // Simple validation to ensure we're not saving empty/malformed data
    if (!body.users || !body.quizzes || !body.settings) {
        return new Response(JSON.stringify({ error: 'Invalid data structure' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 400,
        });
    }

    // Use a transaction to save all parts atomically to the new multi-key structure
    const tx = kv.multi();
    tx.set(KEY_USERS, body.users);
    tx.set(KEY_QUIZZES, body.quizzes);
    tx.set(KEY_SETTINGS, body.settings);
    if (body.moduleCategories) {
        tx.set(KEY_MODULE_CATEGORIES, body.moduleCategories);
    }
    await tx.exec();
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Failed to save data to KV:', error);
    return new Response(JSON.stringify({ error: 'Failed to save data' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}
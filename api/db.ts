import { createClient } from "@vercel/kv";

// This check is to prevent errors during local development if env vars are not set.
// On Vercel, these variables will be provided by the KV integration.
export const kv = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
  ? createClient({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    })
  : null;

// New multi-key structure to avoid 1MB value limit
export const KEY_USERS = "data:users";
export const KEY_QUIZZES = "data:quizzes";
export const KEY_SETTINGS = "data:settings";
export const KEY_MODULE_CATEGORIES = "data:moduleCategories";

// Legacy key for one-time migration
export const LEGACY_DATA_KEY = "cyber-security-training-data";
import { createClient } from "@vercel/kv";

// This check is to prevent errors during local development if env vars are not set.
// On Vercel, these variables will be provided by the KV integration.
export const kv = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
  ? createClient({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    })
  : null;

export const DATA_KEY = "cyber-security-training-data";

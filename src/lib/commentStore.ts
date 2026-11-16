import fs from 'node:fs/promises';
import path from 'node:path';
import { GuestComment } from '@/types/invitation';

/**
 * Guestbook storage.
 * - With Upstash Redis / Vercel KV REST env vars set (under any prefix),
 *   messages live in Redis — required on serverless hosts whose disk is read-only.
 * - Otherwise they are kept in data/comments.json (local dev, VPS, any host with a disk).
 */
function resolveRedisEnv(): { url?: string; token?: string } {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ??
    process.env.KV_REST_API_URL ??
    process.env.STORAGE_KV_REST_API_URL ??
    process.env.STORAGE_REST_API_URL ??
    Object.entries(process.env).find(
      ([k, v]) => (k.endsWith('_REST_API_URL') || k.endsWith('_REDIS_REST_URL')) && Boolean(v)
    )?.[1];

  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ??
    process.env.KV_REST_API_TOKEN ??
    process.env.STORAGE_KV_REST_API_TOKEN ??
    process.env.STORAGE_REST_API_TOKEN ??
    Object.entries(process.env).find(
      ([k, v]) => (k.endsWith('_REST_API_TOKEN') || k.endsWith('_REDIS_REST_TOKEN')) && Boolean(v)
    )?.[1];

  return { url, token };
}

const REDIS_KEY = 'undangan:comments';
const FILE = path.join(process.cwd(), 'data', 'comments.json');
const MAX_COMMENTS = 1000;

async function redis<T>(url: string, token: string, command: (string | number)[]): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Redis ${res.status}`);
  return (await res.json()).result as T;
}

async function readFile(): Promise<GuestComment[]> {
  try {
    const parsed = JSON.parse(await fs.readFile(FILE, 'utf-8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// serialise file writes so two guests submitting at once cannot clobber each other
let writeQueue: Promise<unknown> = Promise.resolve();

export async function listComments(): Promise<GuestComment[]> {
  const { url, token } = resolveRedisEnv();
  if (url && token) {
    const rows = await redis<string[]>(url, token, ['LRANGE', REDIS_KEY, 0, MAX_COMMENTS - 1]);
    return (rows ?? []).map((row) => JSON.parse(row) as GuestComment);
  }
  return readFile();
}

export async function addComment(author: string, message: string): Promise<GuestComment> {
  const comment: GuestComment = {
    id: Date.now(),
    author,
    message,
    date: new Date().toISOString(),
  };

  const { url, token } = resolveRedisEnv();
  if (url && token) {
    await redis(url, token, ['LPUSH', REDIS_KEY, JSON.stringify(comment)]);
    return comment;
  }

  const task = writeQueue.then(async () => {
    const all = await readFile();
    all.unshift(comment);
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(all.slice(0, MAX_COMMENTS), null, 2), 'utf-8');
  });
  writeQueue = task.catch(() => undefined);
  await task;
  return comment;
}

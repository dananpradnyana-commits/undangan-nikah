import fs from 'node:fs/promises';
import path from 'node:path';
import { GuestComment } from '@/types/invitation';

/**
 * Guestbook storage.
 * - With UPSTASH_REDIS_REST_URL/TOKEN (or Vercel KV's KV_REST_API_URL/TOKEN) set,
 *   messages live in Redis — required on serverless hosts whose disk is read-only.
 * - Otherwise they are kept in data/comments.json (local dev, VPS, any host with a disk).
 */
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
const REDIS_KEY = 'undangan:comments';
const FILE = path.join(process.cwd(), 'data', 'comments.json');
const MAX_COMMENTS = 1000;

async function redis<T>(command: (string | number)[]): Promise<T> {
  const res = await fetch(REDIS_URL as string, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' },
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
  if (REDIS_URL && REDIS_TOKEN) {
    const rows = await redis<string[]>(['LRANGE', REDIS_KEY, 0, MAX_COMMENTS - 1]);
    return rows.map((row) => JSON.parse(row) as GuestComment);
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

  if (REDIS_URL && REDIS_TOKEN) {
    await redis(['LPUSH', REDIS_KEY, JSON.stringify(comment)]);
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

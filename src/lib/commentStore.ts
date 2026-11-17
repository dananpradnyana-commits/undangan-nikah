import fs from 'node:fs/promises';
import path from 'node:path';
import { GuestComment } from '@/types/invitation';

/**
 * Sample guestbook wishes used to seed empty storage so pagination & multi-line layout
 * can be previewed immediately on both localhost and Vercel.
 */
const SEED_COMMENTS: GuestComment[] = [
  {
    id: 1763330012000,
    author: 'I Wayan Sudarma & Keluarga',
    message:
      'Selamat menempuh hidup baru Gus Eka & Dek Tini. Semoga langgeng sampai kakek nenek, selalu diberkahi kerahayuan dan kebahagiaan oleh Ida Sang Hyang Widhi Wasa. Astungkara 🙏✨',
    date: new Date(Date.now() - 8 * 60_000).toISOString(),
  },
  {
    id: 1763330011000,
    author: 'Komang Ayu Lestari',
    message:
      'Happy Wedding Gus Eka & Dek Tini! Senang sekali melihat kalian akhirnya sampai di tahap ini. Semoga acara Pawiwahan tanggal 20 November nanti berjalan lancar tanpa halangan. Sampai ketemu di Sidemen yaa! 💐🤍',
    date: new Date(Date.now() - 25 * 60_000).toISOString(),
  },
  {
    id: 1763330010000,
    author: 'Dr. I Made Wirawan, S.Ked',
    message:
      'Selamat berbahagia untuk kedua mempelai beserta keluarga besar di Sidemen, Karangasem. Semoga menjadi keluarga yang Sukinah, berbahagia lahir dan batin.',
    date: new Date(Date.now() - 52 * 60_000).toISOString(),
  },
  {
    id: 1763330009000,
    author: 'Keluarga Besar Br. Dinas Wangsean',
    message:
      'Dumogi sang kalih ngemanggihin kerahayuan lan kerahajengan, sidha karya sidha phala. Selamat atas Pawiwahan Gus Eka & Dek Tini, doa terbaik kami menyertai langkah baru kalian berdua.',
    date: new Date(Date.now() - 2 * 3600_000).toISOString(),
  },
  {
    id: 1763330008000,
    author: 'Ni Luh Putu Maharani',
    message:
      'Cantik dan gagah sekali fotonya! Selamat menempuh hidup baru Dek Tini sayang & Gus Eka. Semoga selalu kompak, saling melengkapi, dan segera dikaruniai momongan yang suputra 🥰🙏',
    date: new Date(Date.now() - 4 * 3600_000).toISOString(),
  },
  {
    id: 1763330007000,
    author: 'Anak Agung Gede Agung',
    message:
      'Rahajeng Pawiwahan Gus Eka & Dek Tini. Semoga ikatan suci pernikahan ini membawa berkah melimpah dan kebahagiaan yang kekal abadi.',
    date: new Date(Date.now() - 7 * 3600_000).toISOString(),
  },
  {
    id: 1763330006000,
    author: 'Ketut Adi Pratama & Partner',
    message:
      'Congrats bro Gus Eka & Dek Tini! Akhirnya berlabuh juga. Semoga langgeng terus, rejeki lancar, dan bahagia selalu di rumah tangga yang baru! 🔥🥂',
    date: new Date(Date.now() - 14 * 3600_000).toISOString(),
  },
  {
    id: 1763330005000,
    author: 'Kadek Sri Wahyuni',
    message:
      'Selamat berbahagia Dek Tini dan suami! Mohon maaf apabila belum bisa hadir langsung, namun doa tulus kami panjatkan semoga acara berjalan lancar dan rumah tangga kalian selalu diberkati.',
    date: new Date(Date.now() - 26 * 3600_000).toISOString(),
  },
  {
    id: 1763330004000,
    author: 'Jero Mangku Dalem',
    message:
      'Om Swastyastu. Dumogi Ida Sang Hyang Widhi Wasa mapaica waranugraha ring sang alaki rabi, mangda state trepti, dirgayusa, lan nemu bagia.',
    date: new Date(Date.now() - 2 * 86400_000).toISOString(),
  },
  {
    id: 1763330003000,
    author: 'Gede Hendra Wijaya',
    message:
      'Happy Wedding Gus Eka & Dek Tini! Semoga selalu rukun dan harmonis selamanya.',
    date: new Date(Date.now() - 3 * 86400_000).toISOString(),
  },
  {
    id: 1763330002000,
    author: 'Putu Dian Pratiwi',
    message:
      'Selamat menempuh hidup baru pasangan serasi! Semoga setiap hari dalam pernikahan kalian dipenuhi tawa, cinta, dan kedamaian. See you on your big day! ✨',
    date: new Date(Date.now() - 4 * 86400_000).toISOString(),
  },
  {
    id: 1763330001000,
    author: 'I Nyoman Bagus Santosa',
    message:
      'Selamat atas acara Pawiwahan putra-putri Bapak/Ibu. Semoga seluruh rangkaian upacara berjalan lancar dan penuh suka cita.',
    date: new Date(Date.now() - 5 * 86400_000).toISOString(),
  },
];

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
    if (Array.isArray(parsed) && parsed.length >= SEED_COMMENTS.length) {
      return parsed;
    }
    const existingIds = new Set(Array.isArray(parsed) ? parsed.map((c: GuestComment) => c.id) : []);
    const merged = [
      ...(Array.isArray(parsed) ? parsed : []),
      ...SEED_COMMENTS.filter((s) => !existingIds.has(s.id)),
    ];
    await fs.mkdir(path.dirname(FILE), { recursive: true }).catch(() => undefined);
    await fs.writeFile(FILE, JSON.stringify(merged, null, 2), 'utf-8').catch(() => undefined);
    return merged;
  } catch {
    return SEED_COMMENTS;
  }
}

// serialise file writes so two guests submitting at once cannot clobber each other
let writeQueue: Promise<unknown> = Promise.resolve();

export async function listComments(): Promise<GuestComment[]> {
  const { url, token } = resolveRedisEnv();
  if (url && token) {
    const rows = (await redis<string[]>(url, token, ['LRANGE', REDIS_KEY, 0, MAX_COMMENTS - 1])) ?? [];
    const parsed = rows.map((row) => JSON.parse(row) as GuestComment);
    if (parsed.length < SEED_COMMENTS.length) {
      const existingIds = new Set(parsed.map((c) => c.id));
      const missing = SEED_COMMENTS.filter((s) => !existingIds.has(s.id));
      if (missing.length > 0) {
        await redis(url, token, ['RPUSH', REDIS_KEY, ...missing.map((m) => JSON.stringify(m))]);
        return [...parsed, ...missing];
      }
    }
    return parsed;
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

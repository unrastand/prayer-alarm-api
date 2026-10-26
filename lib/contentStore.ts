import { put, list } from '@vercel/blob';
import { promises as fs } from 'fs';
import path from 'path';
import {
  ContentSchedule,
  emptySchedule,
  ScheduleEntry,
} from './schedule';

const BLOB_PATHNAME = 'content/schedule.json';
const LOCAL_PATH = path.join(process.cwd(), 'data', 'content', 'schedule.json');

function normalizeSchedule(raw: unknown): ContentSchedule {
  if (!raw || typeof raw !== 'object') return emptySchedule();
  const value = raw as Partial<ContentSchedule>;
  return {
    version: 1,
    updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : new Date().toISOString(),
    entries: Array.isArray(value.entries) ? (value.entries as ScheduleEntry[]) : [],
  };
}

async function loadFromLocalFile(): Promise<ContentSchedule> {
  try {
    const text = await fs.readFile(LOCAL_PATH, 'utf8');
    return normalizeSchedule(JSON.parse(text));
  } catch {
    return emptySchedule();
  }
}

async function saveToLocalFile(schedule: ContentSchedule): Promise<void> {
  await fs.mkdir(path.dirname(LOCAL_PATH), { recursive: true });
  await fs.writeFile(LOCAL_PATH, `${JSON.stringify(schedule, null, 2)}\n`, 'utf8');
}

async function loadFromBlob(): Promise<ContentSchedule | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  const { blobs } = await list({ prefix: BLOB_PATHNAME, limit: 1 });
  const blob = blobs.find((item) => item.pathname === BLOB_PATHNAME) ?? blobs[0];
  if (!blob?.url) return null;
  const res = await fetch(blob.url, { cache: 'no-store' });
  if (!res.ok) return null;
  return normalizeSchedule(await res.json());
}

async function saveToBlob(schedule: ContentSchedule): Promise<void> {
  await put(BLOB_PATHNAME, JSON.stringify(schedule, null, 2), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export function canPersistSchedule(): { ok: boolean; mode: 'blob' | 'local' | 'none'; hint: string } {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return { ok: true, mode: 'blob', hint: 'Saving to Vercel Blob.' };
  }
  if (!process.env.VERCEL) {
    return { ok: true, mode: 'local', hint: 'Saving to local data/content/schedule.json.' };
  }
  return {
    ok: false,
    mode: 'none',
    hint: 'Connect a Vercel Blob store to this project (sets BLOB_READ_WRITE_TOKEN), then redeploy.',
  };
}

export async function loadSchedule(): Promise<ContentSchedule> {
  try {
    const fromBlob = await loadFromBlob();
    if (fromBlob) return fromBlob;
  } catch {
    // fall through to bundled file
  }
  return loadFromLocalFile();
}

export async function saveSchedule(schedule: ContentSchedule): Promise<ContentSchedule> {
  const next: ContentSchedule = {
    ...schedule,
    version: 1,
    updatedAt: new Date().toISOString(),
  };

  const persist = canPersistSchedule();
  if (!persist.ok) {
    throw new Error(persist.hint);
  }

  if (persist.mode === 'blob') {
    await saveToBlob(next);
  } else {
    await saveToLocalFile(next);
  }

  return next;
}

export async function upsertEntry(entry: ScheduleEntry): Promise<ContentSchedule> {
  const schedule = await loadSchedule();
  const idx = schedule.entries.findIndex((item) => item.id === entry.id);
  if (idx >= 0) schedule.entries[idx] = entry;
  else schedule.entries.unshift(entry);
  return saveSchedule(schedule);
}

export async function deleteEntry(id: string): Promise<ContentSchedule> {
  const schedule = await loadSchedule();
  schedule.entries = schedule.entries.filter((item) => item.id !== id);
  return saveSchedule(schedule);
}

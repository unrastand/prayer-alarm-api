import { promises as fs } from 'fs';
import path from 'path';
import {
  BIBLE_BOOK_META,
  type BibleTranslationId,
  getBookMeta,
} from './bibleCatalog';

export type BibleVerse = { verse: number; text: string };
export type BibleChapter = { chapter: number; verses: BibleVerse[] };

const TRANSLATIONS: BibleTranslationId[] = ['web', 'kjv', 'asv', 'bbe'];

export function isTranslation(value: string): value is BibleTranslationId {
  return TRANSLATIONS.includes(value as BibleTranslationId);
}

export function validateChapter(bookId: string, chapter: number) {
  const meta = getBookMeta(bookId);
  if (!meta) return { ok: false as const, error: 'Unknown book' };
  if (!Number.isFinite(chapter) || chapter < 1 || chapter > meta.chapterCount) {
    return { ok: false as const, error: 'Chapter out of range' };
  }
  return { ok: true as const, meta };
}

/** Offline WEB dump: data/bible/web/{bookId}.json */
export async function readOfflineWebChapter(
  bookId: string,
  chapter: number,
): Promise<BibleChapter | null> {
  try {
    const file = path.join(process.cwd(), 'data', 'bible', 'web', `${bookId}.json`);
    const raw = await fs.readFile(file, 'utf8');
    const parsed = JSON.parse(raw) as {
      chapters?: Record<string, BibleVerse[]>;
    };
    const verses = parsed.chapters?.[String(chapter)];
    if (!verses?.length) return null;
    return { chapter, verses };
  } catch {
    return null;
  }
}

export async function fetchUpstreamChapter(
  bookId: string,
  chapter: number,
  translation: BibleTranslationId,
): Promise<BibleChapter> {
  const meta = getBookMeta(bookId);
  if (!meta) throw new Error('Unknown book');

  const ref = encodeURIComponent(`${meta.apiName} ${chapter}`);
  const url = `https://bible-api.com/${ref}?translation=${translation}`;
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 86400 },
  });
  if (!response.ok) {
    throw new Error(`Upstream bible API ${response.status}`);
  }
  const data = (await response.json()) as {
    verses?: { verse: number; text: string }[];
    error?: string;
  };
  if (data.error || !data.verses?.length) {
    throw new Error(data.error || 'Empty chapter');
  }
  return {
    chapter,
    verses: data.verses.map((v) => ({
      verse: v.verse,
      text: v.text.replace(/\n/g, ' ').trim(),
    })),
  };
}

export function listBooks() {
  return BIBLE_BOOK_META;
}

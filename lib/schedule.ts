export type ContentSlot = 'morning' | 'evening';

export type ContentPiece = {
  verse: {
    reference: string;
    text: string;
    translation: string;
  };
  devotion: {
    title: string;
    body: string;
    reflection: string;
  };
};

export type ScheduleEntry = {
  id: string;
  label?: string;
  startDate: string;
  endDate: string;
  slots: ContentSlot[];
  content: ContentPiece;
  createdAt: string;
  updatedAt: string;
};

export type ContentSchedule = {
  version: 1;
  updatedAt: string;
  entries: ScheduleEntry[];
};

export type ResolvedDaily = ContentPiece & {
  date: string;
  slot: ContentSlot;
  source: 'schedule' | 'fallback';
  entryId?: string;
  label?: string;
};

export function emptySchedule(): ContentSchedule {
  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    entries: [],
  };
}

export function isValidDateKey(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function todayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function defaultSlot(date = new Date()): ContentSlot {
  return date.getHours() < 12 ? 'morning' : 'evening';
}

export function rangeForMode(
  mode: 'day' | 'week' | 'month',
  anchorDate: string,
): { startDate: string; endDate: string } {
  const [y, m, d] = anchorDate.split('-').map(Number);
  const anchor = new Date(y, m - 1, d);

  if (mode === 'day') {
    return { startDate: anchorDate, endDate: anchorDate };
  }

  if (mode === 'week') {
    const day = anchor.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;
    const start = new Date(anchor);
    start.setDate(anchor.getDate() + mondayOffset);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return { startDate: todayKey(start), endDate: todayKey(end) };
  }

  const start = new Date(y, m - 1, 1);
  const end = new Date(y, m, 0);
  return { startDate: todayKey(start), endDate: todayKey(end) };
}

function daySpan(startDate: string, endDate: string): number {
  const a = new Date(`${startDate}T00:00:00Z`).getTime();
  const b = new Date(`${endDate}T00:00:00Z`).getTime();
  return Math.max(0, Math.round((b - a) / 86400000));
}

/** Prefer shortest covering range, then newest update. */
export function resolveScheduledContent(
  schedule: ContentSchedule,
  date: string,
  slot: ContentSlot,
): ScheduleEntry | null {
  const matches = schedule.entries.filter(
    (entry) =>
      entry.slots.includes(slot) &&
      entry.startDate <= date &&
      entry.endDate >= date,
  );
  if (!matches.length) return null;

  matches.sort((a, b) => {
    const spanDiff = daySpan(a.startDate, a.endDate) - daySpan(b.startDate, b.endDate);
    if (spanDiff !== 0) return spanDiff;
    return b.updatedAt.localeCompare(a.updatedAt);
  });

  return matches[0] ?? null;
}

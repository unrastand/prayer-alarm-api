import { getFallbackPiece } from '@/lib/content';
import { loadSchedule } from '@/lib/contentStore';
import { json, options } from '@/lib/http';
import {
  ContentSlot,
  defaultSlot,
  isValidDateKey,
  resolveScheduledContent,
  todayKey,
} from '@/lib/schedule';

export function OPTIONS() {
  return options();
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const dateParam = url.searchParams.get('date') || todayKey();
  const slotParam = (url.searchParams.get('slot') || defaultSlot()) as ContentSlot;

  if (!isValidDateKey(dateParam)) {
    return json(null, 400, 'Invalid date. Use YYYY-MM-DD.');
  }
  if (slotParam !== 'morning' && slotParam !== 'evening') {
    return json(null, 400, 'Invalid slot. Use morning or evening.');
  }

  const schedule = await loadSchedule();
  const entry = resolveScheduledContent(schedule, dateParam, slotParam);

  if (entry) {
    return json(
      {
        date: dateParam,
        slot: slotParam,
        source: 'schedule' as const,
        entryId: entry.id,
        label: entry.label,
        verse: entry.content.verse,
        devotion: entry.content.devotion,
      },
      200,
      null,
      60,
    );
  }

  const fallback = getFallbackPiece(dateParam, slotParam);
  return json(
    {
      date: dateParam,
      slot: slotParam,
      source: 'fallback' as const,
      ...fallback,
    },
    200,
    null,
    60,
  );
}

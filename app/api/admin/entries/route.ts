import { NextResponse } from 'next/server';
import { isAdminAuthenticated, isAdminConfigured } from '@/lib/auth';
import { canPersistSchedule, deleteEntry, loadSchedule, upsertEntry } from '@/lib/contentStore';
import {
  ContentPiece,
  ContentSlot,
  isValidDateKey,
  rangeForMode,
  ScheduleEntry,
} from '@/lib/schedule';

function unauthorized() {
  return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 });
}

function badRequest(message: string) {
  return NextResponse.json({ data: null, error: message }, { status: 400 });
}

export async function GET() {
  if (!(await isAdminAuthenticated())) return unauthorized();
  const schedule = await loadSchedule();
  return NextResponse.json({
    data: {
      schedule,
      persist: canPersistSchedule(),
      adminConfigured: isAdminConfigured(),
    },
    error: null,
  });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorized();

  const body = (await request.json().catch(() => null)) as
    | {
        id?: string;
        mode?: 'day' | 'week' | 'month';
        anchorDate?: string;
        startDate?: string;
        endDate?: string;
        slots?: ContentSlot[];
        label?: string;
        content?: ContentPiece;
      }
    | null;

  if (!body?.content?.verse?.reference?.trim() || !body.content.verse.text?.trim()) {
    return badRequest('Verse reference and text are required.');
  }
  if (!body.content.devotion?.title?.trim() || !body.content.devotion.body?.trim()) {
    return badRequest('Devotion title and body are required.');
  }

  const slots = (body.slots || []).filter(
    (slot): slot is ContentSlot => slot === 'morning' || slot === 'evening',
  );
  if (!slots.length) return badRequest('Choose morning, evening, or both.');

  let startDate = body.startDate;
  let endDate = body.endDate;
  if (body.mode && body.anchorDate) {
    if (!isValidDateKey(body.anchorDate)) return badRequest('Invalid anchor date.');
    const range = rangeForMode(body.mode, body.anchorDate);
    startDate = range.startDate;
    endDate = range.endDate;
  }

  if (!startDate || !endDate || !isValidDateKey(startDate) || !isValidDateKey(endDate)) {
    return badRequest('Valid start and end dates are required.');
  }
  if (endDate < startDate) return badRequest('End date must be on or after start date.');

  const now = new Date().toISOString();
  const entry: ScheduleEntry = {
    id: body.id || crypto.randomUUID(),
    label: body.label?.trim() || undefined,
    startDate,
    endDate,
    slots,
    content: {
      verse: {
        reference: body.content.verse.reference.trim(),
        text: body.content.verse.text.trim(),
        translation: (body.content.verse.translation || 'WEB').trim() || 'WEB',
      },
      devotion: {
        title: body.content.devotion.title.trim(),
        body: body.content.devotion.body.trim(),
        reflection: (body.content.devotion.reflection || '').trim(),
      },
    },
    createdAt: now,
    updatedAt: now,
  };

  if (body.id) {
    const existing = (await loadSchedule()).entries.find((item) => item.id === body.id);
    if (existing) entry.createdAt = existing.createdAt;
  }

  try {
    const schedule = await upsertEntry(entry);
    return NextResponse.json({ data: { entry, schedule }, error: null });
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : 'Failed to save.' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorized();
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return badRequest('Missing entry id.');

  try {
    const schedule = await deleteEntry(id);
    return NextResponse.json({ data: { schedule }, error: null });
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : 'Failed to delete.' },
      { status: 500 },
    );
  }
}

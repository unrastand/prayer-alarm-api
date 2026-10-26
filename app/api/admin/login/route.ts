import { NextResponse } from 'next/server';
import {
  checkPassword,
  createSessionToken,
  isAdminConfigured,
  sessionCookieOptions,
} from '@/lib/auth';

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { data: null, error: 'Set ADMIN_PASSWORD in Vercel env vars first.' },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => null)) as { password?: string } | null;
  if (!body?.password || !checkPassword(body.password)) {
    return NextResponse.json({ data: null, error: 'Wrong password.' }, { status: 401 });
  }

  const response = NextResponse.json({ data: { ok: true }, error: null });
  const cookie = sessionCookieOptions(createSessionToken());
  response.cookies.set(cookie);
  return response;
}

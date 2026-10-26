import { NextResponse } from 'next/server';
import { clearSessionCookieOptions } from '@/lib/auth';

export async function POST() {
  const response = NextResponse.json({ data: { ok: true }, error: null });
  response.cookies.set(clearSessionCookieOptions());
  return response;
}

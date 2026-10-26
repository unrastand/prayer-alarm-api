import { NextResponse } from 'next/server';

export function json<T>(
  data: T | null,
  status = 200,
  error: string | null = null,
  cacheSeconds = 0,
) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
  };
  if (cacheSeconds > 0) {
    headers['Cache-Control'] = `public, s-maxage=${cacheSeconds}, stale-while-revalidate=86400`;
  }
  return NextResponse.json({ data, error }, { status, headers });
}

export function options() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
      'Access-Control-Max-Age': '86400',
    },
  });
}

import { json, options } from '@/lib/http';

export function OPTIONS() {
  return options();
}

export function GET() {
  return json({ ok: true, service: 'prayer-alarm-api', host: 'vercel' }, 200);
}

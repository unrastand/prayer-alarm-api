import { getDailyContent } from '@/lib/content';
import { json, options } from '@/lib/http';

export function OPTIONS() {
  return options();
}

export function GET() {
  return json(getDailyContent(), 200, null, 300);
}

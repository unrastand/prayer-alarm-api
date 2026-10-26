import { listBooks } from '@/lib/bible';
import { json, options } from '@/lib/http';

export function OPTIONS() {
  return options();
}

export function GET() {
  return json(listBooks(), 200, null, 86400);
}

import { fetchUpstreamChapter, isTranslation, readOfflineWebChapter, validateChapter } from '@/lib/bible';
import { json, options } from '@/lib/http';

export function OPTIONS() {
  return options();
}

type Params = { translation: string; bookId: string; chapter: string };

export async function GET(
  _request: Request,
  context: { params: Promise<Params> },
) {
  const { translation, bookId, chapter: chapterRaw } = await context.params;
  if (!isTranslation(translation)) {
    return json(null, 400, 'Unsupported translation');
  }
  const chapter = Number(chapterRaw);
  const valid = validateChapter(bookId, chapter);
  if (!valid.ok) {
    return json(null, 400, valid.error);
  }

  try {
    if (translation === 'web') {
      const offline = await readOfflineWebChapter(bookId, chapter);
      if (offline) {
        return json(offline, 200, null, 604800);
      }
    }
    const data = await fetchUpstreamChapter(bookId, chapter, translation);
    return json(data, 200, null, 86400);
  } catch (e) {
    return json(
      null,
      502,
      e instanceof Error ? e.message : 'Failed to load chapter',
    );
  }
}

/** Full Protestant canon metadata (66 books). Chapter text loads on demand. */

export type BibleTranslationId = 'web' | 'kjv' | 'asv' | 'bbe';

export type BibleBookMeta = {
  id: string;
  name: string;
  /** Name accepted by bible-api.com */
  apiName: string;
  abbreviation: string;
  testament: 'OT' | 'NT';
  chapterCount: number;
};

export const BIBLE_TRANSLATIONS: {
  id: BibleTranslationId;
  label: string;
  attribution: string;
}[] = [
  {
    id: 'web',
    label: 'WEB',
    attribution: 'World English Bible (WEB) — public domain.',
  },
  {
    id: 'kjv',
    label: 'KJV',
    attribution: 'King James Version (KJV) — public domain.',
  },
  {
    id: 'asv',
    label: 'ASV',
    attribution: 'American Standard Version (ASV) — public domain.',
  },
  {
    id: 'bbe',
    label: 'BBE',
    attribution: 'Bible in Basic English (BBE) — public domain.',
  },
];

export const BIBLE_BOOK_META: BibleBookMeta[] = [
  { id: 'genesis', name: 'Genesis', apiName: 'Genesis', abbreviation: 'Gen', testament: 'OT', chapterCount: 50 },
  { id: 'exodus', name: 'Exodus', apiName: 'Exodus', abbreviation: 'Exod', testament: 'OT', chapterCount: 40 },
  { id: 'leviticus', name: 'Leviticus', apiName: 'Leviticus', abbreviation: 'Lev', testament: 'OT', chapterCount: 27 },
  { id: 'numbers', name: 'Numbers', apiName: 'Numbers', abbreviation: 'Num', testament: 'OT', chapterCount: 36 },
  { id: 'deuteronomy', name: 'Deuteronomy', apiName: 'Deuteronomy', abbreviation: 'Deut', testament: 'OT', chapterCount: 34 },
  { id: 'joshua', name: 'Joshua', apiName: 'Joshua', abbreviation: 'Josh', testament: 'OT', chapterCount: 24 },
  { id: 'judges', name: 'Judges', apiName: 'Judges', abbreviation: 'Judg', testament: 'OT', chapterCount: 21 },
  { id: 'ruth', name: 'Ruth', apiName: 'Ruth', abbreviation: 'Ruth', testament: 'OT', chapterCount: 4 },
  { id: '1-samuel', name: '1 Samuel', apiName: '1 Samuel', abbreviation: '1Sam', testament: 'OT', chapterCount: 31 },
  { id: '2-samuel', name: '2 Samuel', apiName: '2 Samuel', abbreviation: '2Sam', testament: 'OT', chapterCount: 24 },
  { id: '1-kings', name: '1 Kings', apiName: '1 Kings', abbreviation: '1Kgs', testament: 'OT', chapterCount: 22 },
  { id: '2-kings', name: '2 Kings', apiName: '2 Kings', abbreviation: '2Kgs', testament: 'OT', chapterCount: 25 },
  { id: '1-chronicles', name: '1 Chronicles', apiName: '1 Chronicles', abbreviation: '1Chr', testament: 'OT', chapterCount: 29 },
  { id: '2-chronicles', name: '2 Chronicles', apiName: '2 Chronicles', abbreviation: '2Chr', testament: 'OT', chapterCount: 36 },
  { id: 'ezra', name: 'Ezra', apiName: 'Ezra', abbreviation: 'Ezra', testament: 'OT', chapterCount: 10 },
  { id: 'nehemiah', name: 'Nehemiah', apiName: 'Nehemiah', abbreviation: 'Neh', testament: 'OT', chapterCount: 13 },
  { id: 'esther', name: 'Esther', apiName: 'Esther', abbreviation: 'Esth', testament: 'OT', chapterCount: 10 },
  { id: 'job', name: 'Job', apiName: 'Job', abbreviation: 'Job', testament: 'OT', chapterCount: 42 },
  { id: 'psalms', name: 'Psalms', apiName: 'Psalms', abbreviation: 'Ps', testament: 'OT', chapterCount: 150 },
  { id: 'proverbs', name: 'Proverbs', apiName: 'Proverbs', abbreviation: 'Prov', testament: 'OT', chapterCount: 31 },
  { id: 'ecclesiastes', name: 'Ecclesiastes', apiName: 'Ecclesiastes', abbreviation: 'Eccl', testament: 'OT', chapterCount: 12 },
  { id: 'song-of-solomon', name: 'Song of Solomon', apiName: 'Song of Solomon', abbreviation: 'Song', testament: 'OT', chapterCount: 8 },
  { id: 'isaiah', name: 'Isaiah', apiName: 'Isaiah', abbreviation: 'Isa', testament: 'OT', chapterCount: 66 },
  { id: 'jeremiah', name: 'Jeremiah', apiName: 'Jeremiah', abbreviation: 'Jer', testament: 'OT', chapterCount: 52 },
  { id: 'lamentations', name: 'Lamentations', apiName: 'Lamentations', abbreviation: 'Lam', testament: 'OT', chapterCount: 5 },
  { id: 'ezekiel', name: 'Ezekiel', apiName: 'Ezekiel', abbreviation: 'Ezek', testament: 'OT', chapterCount: 48 },
  { id: 'daniel', name: 'Daniel', apiName: 'Daniel', abbreviation: 'Dan', testament: 'OT', chapterCount: 12 },
  { id: 'hosea', name: 'Hosea', apiName: 'Hosea', abbreviation: 'Hos', testament: 'OT', chapterCount: 14 },
  { id: 'joel', name: 'Joel', apiName: 'Joel', abbreviation: 'Joel', testament: 'OT', chapterCount: 3 },
  { id: 'amos', name: 'Amos', apiName: 'Amos', abbreviation: 'Amos', testament: 'OT', chapterCount: 9 },
  { id: 'obadiah', name: 'Obadiah', apiName: 'Obadiah', abbreviation: 'Obad', testament: 'OT', chapterCount: 1 },
  { id: 'jonah', name: 'Jonah', apiName: 'Jonah', abbreviation: 'Jonah', testament: 'OT', chapterCount: 4 },
  { id: 'micah', name: 'Micah', apiName: 'Micah', abbreviation: 'Mic', testament: 'OT', chapterCount: 7 },
  { id: 'nahum', name: 'Nahum', apiName: 'Nahum', abbreviation: 'Nah', testament: 'OT', chapterCount: 3 },
  { id: 'habakkuk', name: 'Habakkuk', apiName: 'Habakkuk', abbreviation: 'Hab', testament: 'OT', chapterCount: 3 },
  { id: 'zephaniah', name: 'Zephaniah', apiName: 'Zephaniah', abbreviation: 'Zeph', testament: 'OT', chapterCount: 3 },
  { id: 'haggai', name: 'Haggai', apiName: 'Haggai', abbreviation: 'Hag', testament: 'OT', chapterCount: 2 },
  { id: 'zechariah', name: 'Zechariah', apiName: 'Zechariah', abbreviation: 'Zech', testament: 'OT', chapterCount: 14 },
  { id: 'malachi', name: 'Malachi', apiName: 'Malachi', abbreviation: 'Mal', testament: 'OT', chapterCount: 4 },
  { id: 'matthew', name: 'Matthew', apiName: 'Matthew', abbreviation: 'Matt', testament: 'NT', chapterCount: 28 },
  { id: 'mark', name: 'Mark', apiName: 'Mark', abbreviation: 'Mark', testament: 'NT', chapterCount: 16 },
  { id: 'luke', name: 'Luke', apiName: 'Luke', abbreviation: 'Luke', testament: 'NT', chapterCount: 24 },
  { id: 'john', name: 'John', apiName: 'John', abbreviation: 'John', testament: 'NT', chapterCount: 21 },
  { id: 'acts', name: 'Acts', apiName: 'Acts', abbreviation: 'Acts', testament: 'NT', chapterCount: 28 },
  { id: 'romans', name: 'Romans', apiName: 'Romans', abbreviation: 'Rom', testament: 'NT', chapterCount: 16 },
  { id: '1-corinthians', name: '1 Corinthians', apiName: '1 Corinthians', abbreviation: '1Cor', testament: 'NT', chapterCount: 16 },
  { id: '2-corinthians', name: '2 Corinthians', apiName: '2 Corinthians', abbreviation: '2Cor', testament: 'NT', chapterCount: 13 },
  { id: 'galatians', name: 'Galatians', apiName: 'Galatians', abbreviation: 'Gal', testament: 'NT', chapterCount: 6 },
  { id: 'ephesians', name: 'Ephesians', apiName: 'Ephesians', abbreviation: 'Eph', testament: 'NT', chapterCount: 6 },
  { id: 'philippians', name: 'Philippians', apiName: 'Philippians', abbreviation: 'Phil', testament: 'NT', chapterCount: 4 },
  { id: 'colossians', name: 'Colossians', apiName: 'Colossians', abbreviation: 'Col', testament: 'NT', chapterCount: 4 },
  { id: '1-thessalonians', name: '1 Thessalonians', apiName: '1 Thessalonians', abbreviation: '1Thess', testament: 'NT', chapterCount: 5 },
  { id: '2-thessalonians', name: '2 Thessalonians', apiName: '2 Thessalonians', abbreviation: '2Thess', testament: 'NT', chapterCount: 3 },
  { id: '1-timothy', name: '1 Timothy', apiName: '1 Timothy', abbreviation: '1Tim', testament: 'NT', chapterCount: 6 },
  { id: '2-timothy', name: '2 Timothy', apiName: '2 Timothy', abbreviation: '2Tim', testament: 'NT', chapterCount: 4 },
  { id: 'titus', name: 'Titus', apiName: 'Titus', abbreviation: 'Titus', testament: 'NT', chapterCount: 3 },
  { id: 'philemon', name: 'Philemon', apiName: 'Philemon', abbreviation: 'Phlm', testament: 'NT', chapterCount: 1 },
  { id: 'hebrews', name: 'Hebrews', apiName: 'Hebrews', abbreviation: 'Heb', testament: 'NT', chapterCount: 13 },
  { id: 'james', name: 'James', apiName: 'James', abbreviation: 'Jas', testament: 'NT', chapterCount: 5 },
  { id: '1-peter', name: '1 Peter', apiName: '1 Peter', abbreviation: '1Pet', testament: 'NT', chapterCount: 5 },
  { id: '2-peter', name: '2 Peter', apiName: '2 Peter', abbreviation: '2Pet', testament: 'NT', chapterCount: 3 },
  { id: '1-john', name: '1 John', apiName: '1 John', abbreviation: '1John', testament: 'NT', chapterCount: 5 },
  { id: '2-john', name: '2 John', apiName: '2 John', abbreviation: '2John', testament: 'NT', chapterCount: 1 },
  { id: '3-john', name: '3 John', apiName: '3 John', abbreviation: '3John', testament: 'NT', chapterCount: 1 },
  { id: 'jude', name: 'Jude', apiName: 'Jude', abbreviation: 'Jude', testament: 'NT', chapterCount: 1 },
  { id: 'revelation', name: 'Revelation', apiName: 'Revelation', abbreviation: 'Rev', testament: 'NT', chapterCount: 22 },
];

export function getBookMeta(bookId: string): BibleBookMeta | undefined {
  return BIBLE_BOOK_META.find((b) => b.id === bookId);
}

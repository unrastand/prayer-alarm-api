export type DailyContent = {
  date: string;
  verse: {
    reference: string;
    text: string;
    translation: string;
  };
  devotion: {
    title: string;
    body: string;
    reflection: string;
  };
};

export type PrayerCatalogItem = {
  id: string;
  title: string;
  category: string;
  durationSeconds: number;
  audioUrl: string | null;
  text: string;
  scriptureReference?: string;
};

export type VerseContent = {
  id: string;
  reference: string;
  text: string;
  translation: string;
  theme?: string;
};

const DEVOTIONS: Omit<DailyContent, 'date'>[] = [
  {
    verse: {
      reference: 'Psalm 5:3',
      text: 'Yahweh, in the morning you will hear my voice. In the morning I will lay my requests before you, and will watch expectantly.',
      translation: 'WEB',
    },
    devotion: {
      title: 'Begin With Expectation',
      body: 'Prayer is not a hurried checklist. It is a quiet turning of the heart toward God at the start of the day. Bring your needs honestly, then wait with gentle expectation.',
      reflection: 'What one request will you lay before God this morning?',
    },
  },
  {
    verse: {
      reference: 'Philippians 4:6-7',
      text: 'In nothing be anxious, but in everything, by prayer and petition with thanksgiving, let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts and your thoughts in Christ Jesus.',
      translation: 'WEB',
    },
    devotion: {
      title: 'Peace Through Prayer',
      body: 'Anxiety loosens its grip when we trade worry for conversation with God. Thanksgiving keeps our hearts soft while we ask for help.',
      reflection: 'Where do you need God’s peace to guard your thoughts today?',
    },
  },
  {
    verse: {
      reference: 'Psalm 46:10',
      text: '“Be still, and know that I am God. I will be exalted among the nations. I will be exalted in the earth.”',
      translation: 'WEB',
    },
    devotion: {
      title: 'Stillness Before Strength',
      body: 'Stillness is not emptiness. It is trust. In a quiet moment, remember who holds your day.',
      reflection: 'Can you set aside two minutes today simply to be still before God?',
    },
  },
];

export const PRAYERS: PrayerCatalogItem[] = [
  {
    id: 'morning-presence',
    title: 'Morning Presence',
    category: 'morning',
    durationSeconds: 180,
    audioUrl: null,
    text: 'Father, thank You for this new day. Open my eyes to Your goodness, guide my steps, and fill my heart with peace as I walk with You.',
    scriptureReference: 'Psalm 5:3',
  },
  {
    id: 'evening-rest',
    title: 'Evening Rest',
    category: 'evening',
    durationSeconds: 180,
    audioUrl: null,
    text: 'Lord, I place this day into Your hands. Forgive what was unfinished, heal what was wounded, and grant me rest under Your care.',
    scriptureReference: 'Psalm 4:8',
  },
  {
    id: 'thanksgiving-simple',
    title: 'Simple Thanksgiving',
    category: 'thanksgiving',
    durationSeconds: 120,
    audioUrl: null,
    text: 'God of every good gift, I thank You for life, breath, and mercy that meets me again today. Teach me gratitude in both plenty and need.',
    scriptureReference: '1 Thessalonians 5:18',
  },
  {
    id: 'peace-guidance',
    title: 'Peace and Guidance',
    category: 'peace',
    durationSeconds: 150,
    audioUrl: null,
    text: 'Prince of Peace, quiet the noise within me. Lead me in wisdom and keep my heart steady in Your love.',
    scriptureReference: 'Isaiah 26:3',
  },
  {
    id: 'wisdom-strength',
    title: 'Wisdom and Strength',
    category: 'wisdom',
    durationSeconds: 150,
    audioUrl: null,
    text: 'God of wisdom, give me understanding for today’s decisions and strength for today’s work. Let Your Word light my path.',
    scriptureReference: 'James 1:5',
  },
  {
    id: 'family-blessing',
    title: 'Family and Relationships',
    category: 'family',
    durationSeconds: 150,
    audioUrl: null,
    text: 'Father, bless those I love. Grow patience, kindness, and forgiveness in our relationships. Make our home a place of grace.',
    scriptureReference: 'Colossians 3:12-14',
  },
  {
    id: 'work-daily',
    title: 'Work and Daily Duties',
    category: 'work',
    durationSeconds: 120,
    audioUrl: null,
    text: 'Lord, bless the work of my hands. Help me serve with integrity, diligence, and a gentle spirit toward those I meet.',
    scriptureReference: 'Colossians 3:23',
  },
  {
    id: 'scripture-meditation',
    title: 'Scripture Meditation',
    category: 'meditation',
    durationSeconds: 240,
    audioUrl: null,
    text: 'Holy Spirit, slow my thoughts. Let Your Word dwell richly in me. Shape my desires to love what You love.',
    scriptureReference: 'Psalm 119:105',
  },
];

export const VERSES: VerseContent[] = [
  {
    id: 'psalm-23-1',
    reference: 'Psalm 23:1',
    text: 'Yahweh is my shepherd; I shall lack nothing.',
    translation: 'WEB',
    theme: 'trust',
  },
  {
    id: 'john-3-16',
    reference: 'John 3:16',
    text: 'For God so loved the world, that he gave his only born Son, that whoever believes in him should not perish, but have eternal life.',
    translation: 'WEB',
    theme: 'love',
  },
  {
    id: 'matthew-11-28',
    reference: 'Matthew 11:28',
    text: '“Come to me, all you who labor and are heavily burdened, and I will give you rest.”',
    translation: 'WEB',
    theme: 'rest',
  },
  {
    id: 'joshua-1-9',
    reference: 'Joshua 1:9',
    text: 'Haven’t I commanded you? Be strong and courageous. Don’t be afraid. Don’t be dismayed, for Yahweh your God is with you wherever you go.',
    translation: 'WEB',
    theme: 'courage',
  },
];

export function getDailyContent(date = new Date()): DailyContent {
  const key = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
  const idx = Math.abs(hashString(key)) % DEVOTIONS.length;
  return { date: key, ...DEVOTIONS[idx] };
}

export function getFallbackPiece(dateKey: string, slot: 'morning' | 'evening') {
  const idx = Math.abs(hashString(`${dateKey}:${slot}`)) % DEVOTIONS.length;
  return DEVOTIONS[idx];
}

function hashString(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return h;
}

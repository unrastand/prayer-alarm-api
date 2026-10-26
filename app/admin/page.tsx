'use client';

import {
  CSSProperties,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

type Slot = 'morning' | 'evening';
type Mode = 'day' | 'week' | 'month';

type ContentPiece = {
  verse: { reference: string; text: string; translation: string };
  devotion: { title: string; body: string; reflection: string };
};

type ScheduleEntry = {
  id: string;
  label?: string;
  startDate: string;
  endDate: string;
  slots: Slot[];
  content: ContentPiece;
  createdAt: string;
  updatedAt: string;
};

type PersistInfo = { ok: boolean; mode: string; hint: string };

const emptyContent = (): ContentPiece => ({
  verse: { reference: '', text: '', translation: 'WEB' },
  devotion: { title: '', body: '', reflection: '' },
});

function todayLocal(): string {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
}

export default function AdminPage() {
  const [booting, setBooting] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [persist, setPersist] = useState<PersistInfo | null>(null);
  const [entries, setEntries] = useState<ScheduleEntry[]>([]);

  const [mode, setMode] = useState<Mode>('day');
  const [anchorDate, setAnchorDate] = useState(todayLocal());
  const [slots, setSlots] = useState<Slot[]>(['morning']);
  const [label, setLabel] = useState('');
  const [content, setContent] = useState<ContentPiece>(emptyContent());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadEntries = useCallback(async () => {
    const res = await fetch('/api/admin/entries', { credentials: 'include' });
    if (res.status === 401) {
      setAuthed(false);
      setBooting(false);
      return;
    }
    const body = await res.json();
    if (!res.ok) {
      setError(body.error || 'Could not load entries.');
      setBooting(false);
      return;
    }
    setAuthed(true);
    setEntries(body.data.schedule.entries || []);
    setPersist(body.data.persist);
    setBooting(false);
  }, []);

  useEffect(() => {
    loadEntries().catch(() => {
      setBooting(false);
      setAuthed(false);
    });
  }, [loadEntries]);

  const rangePreview = useMemo(() => {
    if (!anchorDate) return '';
    const [y, m, d] = anchorDate.split('-').map(Number);
    const anchor = new Date(y, m - 1, d);
    if (mode === 'day') return `${anchorDate} → ${anchorDate}`;
    if (mode === 'week') {
      const day = anchor.getDay();
      const mondayOffset = day === 0 ? -6 : 1 - day;
      const start = new Date(anchor);
      start.setDate(anchor.getDate() + mondayOffset);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      const fmt = (value: Date) =>
        [
          value.getFullYear(),
          String(value.getMonth() + 1).padStart(2, '0'),
          String(value.getDate()).padStart(2, '0'),
        ].join('-');
      return `${fmt(start)} → ${fmt(end)}`;
    }
    const start = `${y}-${String(m).padStart(2, '0')}-01`;
    const endDate = new Date(y, m, 0).getDate();
    const end = `${y}-${String(m).padStart(2, '0')}-${String(endDate).padStart(2, '0')}`;
    return `${start} → ${end}`;
  }, [anchorDate, mode]);

  async function onLogin(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setStatus(null);
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ password }),
    });
    const body = await res.json();
    if (!res.ok) {
      setError(body.error || 'Login failed.');
      return;
    }
    setPassword('');
    await loadEntries();
  }

  async function onLogout() {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
    setAuthed(false);
    setEntries([]);
  }

  function toggleSlot(slot: Slot) {
    setSlots((current) => {
      if (current.includes(slot)) {
        const next = current.filter((item) => item !== slot);
        return next.length ? next : current;
      }
      return [...current, slot];
    });
  }

  function startEdit(entry: ScheduleEntry) {
    setEditingId(entry.id);
    setLabel(entry.label || '');
    setSlots([...entry.slots]);
    setContent(entry.content);
    setAnchorDate(entry.startDate);
    setMode(entry.startDate === entry.endDate ? 'day' : 'week');
    setStatus(`Editing ${entry.id.slice(0, 8)}…`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetForm() {
    setEditingId(null);
    setLabel('');
    setSlots(['morning']);
    setContent(emptyContent());
    setAnchorDate(todayLocal());
    setMode('day');
    setStatus(null);
  }

  async function onSave(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setStatus(null);
    try {
      const res = await fetch('/api/admin/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: editingId || undefined,
          mode,
          anchorDate,
          slots,
          label: label || undefined,
          content,
        }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error || 'Save failed.');
        return;
      }
      setEntries(body.data.schedule.entries || []);
      setStatus(editingId ? 'Entry updated.' : 'Entry published for the app.');
      resetForm();
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    if (!window.confirm('Delete this scheduled content?')) return;
    const res = await fetch(`/api/admin/entries?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const body = await res.json();
    if (!res.ok) {
      setError(body.error || 'Delete failed.');
      return;
    }
    setEntries(body.data.schedule.entries || []);
    setStatus('Entry deleted.');
  }

  if (booting) {
    return (
      <main style={styles.shell}>
        <p style={styles.muted}>Loading admin…</p>
      </main>
    );
  }

  if (!authed) {
    return (
      <main style={styles.shell}>
        <section style={styles.card}>
          <p style={styles.eyebrow}>Prayer Alarm</p>
          <h1 style={styles.title}>Content admin</h1>
          <p style={styles.muted}>
            Sign in to schedule morning and evening scripture for a day, week, or month.
          </p>
          <form onSubmit={onLogin} style={{ marginTop: 24, display: 'grid', gap: 12 }}>
            <label style={styles.label}>
              Admin password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                autoFocus
                required
              />
            </label>
            <button type="submit" style={styles.primaryBtn}>
              Sign in
            </button>
          </form>
          {error ? <p style={styles.error}>{error}</p> : null}
        </section>
      </main>
    );
  }

  return (
    <main style={styles.shell}>
      <header style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Prayer Alarm</p>
          <h1 style={styles.title}>Schedule content</h1>
        </div>
        <button type="button" onClick={onLogout} style={styles.ghostBtn}>
          Sign out
        </button>
      </header>

      {persist && !persist.ok ? (
        <div style={styles.warn}>
          Saves will fail until Blob storage is connected. {persist.hint}
        </div>
      ) : null}
      {persist?.ok ? <p style={styles.muted}>{persist.hint}</p> : null}
      {status ? <p style={styles.ok}>{status}</p> : null}
      {error ? <p style={styles.error}>{error}</p> : null}

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>{editingId ? 'Edit entry' : 'New entry'}</h2>
        <form onSubmit={onSave} style={{ display: 'grid', gap: 16 }}>
          <div style={styles.row}>
            {(
              [
                ['day', 'One day'],
                ['week', 'Whole week'],
                ['month', 'Whole month'],
              ] as const
            ).map(([value, labelText]) => (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                style={mode === value ? styles.chipActive : styles.chip}
              >
                {labelText}
              </button>
            ))}
          </div>

          <label style={styles.label}>
            Anchor date
            <input
              type="date"
              value={anchorDate}
              onChange={(e) => setAnchorDate(e.target.value)}
              style={styles.input}
              required
            />
          </label>
          <p style={styles.muted}>Applies to: {rangePreview}</p>

          <div>
            <p style={styles.labelText}>Time of day</p>
            <div style={styles.row}>
              {(['morning', 'evening'] as const).map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => toggleSlot(slot)}
                  style={slots.includes(slot) ? styles.chipActive : styles.chip}
                >
                  {slot === 'morning' ? 'Morning' : 'Evening'}
                </button>
              ))}
            </div>
          </div>

          <label style={styles.label}>
            Optional label
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Holy Week mornings"
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Verse reference
            <input
              value={content.verse.reference}
              onChange={(e) =>
                setContent((c) => ({ ...c, verse: { ...c.verse, reference: e.target.value } }))
              }
              placeholder="Psalm 23:1"
              style={styles.input}
              required
            />
          </label>

          <label style={styles.label}>
            Verse text
            <textarea
              value={content.verse.text}
              onChange={(e) =>
                setContent((c) => ({ ...c, verse: { ...c.verse, text: e.target.value } }))
              }
              rows={3}
              style={styles.textarea}
              required
            />
          </label>

          <label style={styles.label}>
            Translation
            <input
              value={content.verse.translation}
              onChange={(e) =>
                setContent((c) => ({
                  ...c,
                  verse: { ...c.verse, translation: e.target.value },
                }))
              }
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Devotion title
            <input
              value={content.devotion.title}
              onChange={(e) =>
                setContent((c) => ({
                  ...c,
                  devotion: { ...c.devotion, title: e.target.value },
                }))
              }
              style={styles.input}
              required
            />
          </label>

          <label style={styles.label}>
            Devotion body
            <textarea
              value={content.devotion.body}
              onChange={(e) =>
                setContent((c) => ({
                  ...c,
                  devotion: { ...c.devotion, body: e.target.value },
                }))
              }
              rows={5}
              style={styles.textarea}
              required
            />
          </label>

          <label style={styles.label}>
            Reflection prompt
            <textarea
              value={content.devotion.reflection}
              onChange={(e) =>
                setContent((c) => ({
                  ...c,
                  devotion: { ...c.devotion, reflection: e.target.value },
                }))
              }
              rows={2}
              style={styles.textarea}
            />
          </label>

          <div style={styles.row}>
            <button type="submit" style={styles.primaryBtn} disabled={saving}>
              {saving ? 'Saving…' : editingId ? 'Update entry' : 'Publish to app'}
            </button>
            {editingId ? (
              <button type="button" onClick={resetForm} style={styles.ghostBtn}>
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section style={{ ...styles.card, marginTop: 24 }}>
        <h2 style={styles.sectionTitle}>Scheduled entries ({entries.length})</h2>
        {!entries.length ? (
          <p style={styles.muted}>Nothing scheduled yet. Publish a day, week, or month above.</p>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {entries.map((entry) => (
              <article key={entry.id} style={styles.entry}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <strong>{entry.label || entry.content.devotion.title}</strong>
                    <p style={styles.muted}>
                      {entry.startDate}
                      {entry.endDate !== entry.startDate ? ` → ${entry.endDate}` : ''} ·{' '}
                      {entry.slots.join(' + ')}
                    </p>
                    <p style={{ margin: '8px 0 0', lineHeight: 1.45 }}>
                      {entry.content.verse.reference}: {entry.content.verse.text.slice(0, 120)}
                      {entry.content.verse.text.length > 120 ? '…' : ''}
                    </p>
                  </div>
                  <div style={{ display: 'grid', gap: 8, alignContent: 'start' }}>
                    <button type="button" style={styles.ghostBtn} onClick={() => startEdit(entry)}>
                      Edit
                    </button>
                    <button type="button" style={styles.dangerBtn} onClick={() => onDelete(entry.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <p style={{ ...styles.muted, marginTop: 28 }}>
        App endpoint:{' '}
        <a href="/api/v1/content/daily?slot=morning" style={styles.link}>
          /api/v1/content/daily?slot=morning
        </a>
      </p>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  shell: {
    minHeight: '100vh',
    background:
      'radial-gradient(circle at top left, #f3e7d4 0%, #f7f1e7 42%, #efe4d4 100%)',
    color: '#2b1a16',
    fontFamily: 'Georgia, "Times New Roman", serif',
    padding: '32px 20px 64px',
    maxWidth: 880,
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 20,
  },
  card: {
    background: 'rgba(255,252,247,0.92)',
    border: '1px solid rgba(109,36,53,0.12)',
    borderRadius: 18,
    padding: 24,
    boxShadow: '0 18px 40px rgba(70, 36, 24, 0.06)',
  },
  eyebrow: {
    margin: 0,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    fontSize: 12,
    fontFamily: 'system-ui, sans-serif',
    color: '#6d2435',
  },
  title: {
    margin: '6px 0 0',
    fontSize: 34,
    fontWeight: 500,
  },
  sectionTitle: {
    margin: '0 0 16px',
    fontSize: 22,
    fontWeight: 500,
  },
  muted: {
    color: '#6b564c',
    fontFamily: 'system-ui, sans-serif',
    fontSize: 14,
    lineHeight: 1.5,
  },
  label: {
    display: 'grid',
    gap: 6,
    fontFamily: 'system-ui, sans-serif',
    fontSize: 13,
    color: '#4d3830',
  },
  labelText: {
    margin: '0 0 8px',
    fontFamily: 'system-ui, sans-serif',
    fontSize: 13,
    color: '#4d3830',
  },
  input: {
    border: '1px solid rgba(109,36,53,0.18)',
    borderRadius: 10,
    padding: '10px 12px',
    fontSize: 15,
    fontFamily: 'system-ui, sans-serif',
    background: '#fffaf3',
  },
  textarea: {
    border: '1px solid rgba(109,36,53,0.18)',
    borderRadius: 10,
    padding: '10px 12px',
    fontSize: 15,
    fontFamily: 'system-ui, sans-serif',
    background: '#fffaf3',
    resize: 'vertical' as const,
  },
  row: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 8,
  },
  chip: {
    border: '1px solid rgba(109,36,53,0.2)',
    background: 'transparent',
    color: '#6d2435',
    borderRadius: 999,
    padding: '8px 14px',
    fontFamily: 'system-ui, sans-serif',
    cursor: 'pointer',
  },
  chipActive: {
    border: '1px solid #6d2435',
    background: '#6d2435',
    color: '#fff8f0',
    borderRadius: 999,
    padding: '8px 14px',
    fontFamily: 'system-ui, sans-serif',
    cursor: 'pointer',
  },
  primaryBtn: {
    border: 0,
    background: '#6d2435',
    color: '#fff8f0',
    borderRadius: 12,
    padding: '12px 18px',
    fontFamily: 'system-ui, sans-serif',
    fontSize: 15,
    cursor: 'pointer',
  },
  ghostBtn: {
    border: '1px solid rgba(109,36,53,0.2)',
    background: 'transparent',
    color: '#6d2435',
    borderRadius: 12,
    padding: '10px 14px',
    fontFamily: 'system-ui, sans-serif',
    cursor: 'pointer',
  },
  dangerBtn: {
    border: '1px solid rgba(140,40,40,0.35)',
    background: 'transparent',
    color: '#8c2828',
    borderRadius: 12,
    padding: '10px 14px',
    fontFamily: 'system-ui, sans-serif',
    cursor: 'pointer',
  },
  entry: {
    borderTop: '1px solid rgba(109,36,53,0.1)',
    paddingTop: 14,
  },
  error: {
    color: '#8c2828',
    fontFamily: 'system-ui, sans-serif',
    marginTop: 12,
  },
  ok: {
    color: '#2f5d3a',
    fontFamily: 'system-ui, sans-serif',
    marginTop: 8,
  },
  warn: {
    background: '#fff1d6',
    border: '1px solid #e0b45a',
    borderRadius: 12,
    padding: '12px 14px',
    marginBottom: 16,
    fontFamily: 'system-ui, sans-serif',
    fontSize: 14,
  },
  link: {
    color: '#6d2435',
  },
};

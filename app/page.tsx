export default function Home() {
  return (
    <main
      style={{
        fontFamily: 'Georgia, "Times New Roman", serif',
        padding: 32,
        maxWidth: 640,
        margin: '0 auto',
        color: '#2b1a16',
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top left, #f3e7d4 0%, #f7f1e7 42%, #efe4d4 100%)',
      }}
    >
      <p
        style={{
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          fontSize: 12,
          fontFamily: 'system-ui, sans-serif',
          color: '#6d2435',
          marginBottom: 8,
        }}
      >
        Prayer Alarm
      </p>
      <h1 style={{ fontWeight: 500, marginTop: 0 }}>Scripture API</h1>
      <p style={{ fontFamily: 'system-ui, sans-serif', color: '#6b564c', lineHeight: 1.5 }}>
        Backend for the Prayer Alarm mobile app. Schedule morning and evening devotionals from
        the admin UI.
      </p>
      <ul style={{ fontFamily: 'system-ui, sans-serif', lineHeight: 1.8 }}>
        <li>
          <a href="/admin" style={{ color: '#6d2435' }}>
            /admin
          </a>{' '}
          — update daily content
        </li>
        <li>
          <a href="/api/v1/health" style={{ color: '#6d2435' }}>
            /api/v1/health
          </a>
        </li>
        <li>
          <a href="/api/v1/content/daily?slot=morning" style={{ color: '#6d2435' }}>
            /api/v1/content/daily?slot=morning
          </a>
        </li>
        <li>
          <a href="/api/v1/bible/web/psalms/23" style={{ color: '#6d2435' }}>
            /api/v1/bible/web/psalms/23
          </a>
        </li>
      </ul>
    </main>
  );
}

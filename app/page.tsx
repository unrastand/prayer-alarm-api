export default function Home() {
  return (
    <main style={{ fontFamily: 'system-ui', padding: 32, maxWidth: 640 }}>
      <h1>Prayer Alarm API</h1>
      <p>Scripture and content backend for the Prayer Alarm mobile app.</p>
      <ul>
        <li>
          <a href="/api/v1/health">/api/v1/health</a>
        </li>
        <li>
          <a href="/api/v1/bible/web/psalms/23">/api/v1/bible/web/psalms/23</a>
        </li>
      </ul>
    </main>
  );
}

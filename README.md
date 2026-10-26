# Prayer Alarm API

Vercel backend for Prayer Alarm (scripture + daily content).

## Deploy

1. Import this repo in [Vercel](https://vercel.com/new)
2. Framework: Next.js (auto-detected)
3. Root directory: `.` (repo root)
4. Deploy

After deploy, set mobile `EXPO_PUBLIC_API_URL` to the Vercel URL (no trailing slash).

## Endpoints

- `GET /api/v1/health`
- `GET /api/v1/content/daily`
- `GET /api/v1/content/prayers`
- `GET /api/v1/content/verses`
- `GET /api/v1/bible/books`
- `GET /api/v1/bible/:translation/:bookId/:chapter` (web|kjv|asv|bbe)

WEB chapters use the bundled dump under `data/bible/web/` when present.

## Local

```bash
npm install
npm run dev
```

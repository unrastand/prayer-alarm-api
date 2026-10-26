# Prayer Alarm API (Vercel)

Replaces the Cloudflare Worker as the scripture / content backend.

## Content admin

Open **`/admin`** on your Vercel URL (e.g. `https://prayer-alarm-api-eta.vercel.app/admin`).

You can publish devotionals for:

- **One day**, a **whole week** (Mon–Sun), or a **whole month**
- **Morning**, **evening**, or both

The mobile app requests today’s content with `?slot=morning|evening` (before noon → morning).

### Vercel env vars

| Variable | Required | Purpose |
| --- | --- | --- |
| `ADMIN_PASSWORD` | Yes | Password for `/admin` |
| `ADMIN_SESSION_SECRET` | Recommended | Signs the admin cookie (defaults to password) |
| `BLOB_READ_WRITE_TOKEN` | Yes in production | Set automatically when you connect a **Vercel Blob** store |

In the Vercel project: **Storage → Create Blob Store → Connect** to this project, then redeploy. Without Blob, production saves will fail (local `npm run dev` still writes to `data/content/schedule.json`).

## Endpoints

- `GET /api/v1/health`
- `GET /api/v1/content/daily?date=YYYY-MM-DD&slot=morning|evening`
- `GET /api/v1/content/prayers`
- `GET /api/v1/content/verses`
- `GET /api/v1/bible/books`
- `GET /api/v1/bible/:translation/:bookId/:chapter` — `web|kjv|asv|bbe`
- `POST /api/admin/login` · `POST /api/admin/logout`
- `GET|POST|DELETE /api/admin/entries` (cookie auth)

WEB chapters prefer the offline dump under `data/bible/web/` when present; otherwise they proxy [bible-api.com](https://bible-api.com).

## Local

```bash
cd apps/api
npm install
npm run fetch:web-bible   # full WEB dump for Vercel + mobile APK offline
set ADMIN_PASSWORD=secret
npm run dev
```

Open http://localhost:3001/admin

## Deploy

Push this repo (or sync from the monorepo `apps/api`) and redeploy on Vercel. Set the env vars above, connect Blob, then open `/admin`.

Set mobile `EXPO_PUBLIC_API_URL` to the Vercel URL (no trailing slash).

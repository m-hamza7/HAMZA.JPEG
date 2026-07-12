# 07 — Deployment

> **Status:** 🔜 Planned. This page documents the target deployment strategy for Phase 2.

---

## Current (Development)

| Service | URL |
|---------|-----|
| Frontend (Vite) | `http://localhost:5173` (or next available port) |
| Backend (Express) | `http://localhost:5000` |
| Supabase | Cloud (always on) |

Run both locally:
```bash
# Terminal 1 — Frontend
pnpm run dev

# Terminal 2 — Backend
cd backend && npm run dev
```

### Frontend `.env` (project root)
```
VITE_API_URL=http://localhost:5000
```

---

## Pre-Deployment Checklist

### Supabase
- [x] Run `supabase_migration.sql` in SQL Editor
- [x] Create `portfolio` bucket (Public)
- [x] Copy `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from Dashboard → Settings → API

### Backend `.env`
- [x] `SUPABASE_URL` set
- [x] `SUPABASE_SERVICE_ROLE_KEY` set
- [x] `SUPABASE_BUCKET=portfolio`
- [ ] `PORT=5000` (or platform-assigned)
- [ ] `ALLOWED_ORIGIN=https://your-frontend-domain.com` (restrict CORS in production)

### Frontend `.env`
- [x] `VITE_API_URL=http://localhost:5000` (dev)
- [ ] `VITE_API_URL=https://your-backend.railway.app` (production)

---

## Target Deployment Architecture

```
GitHub
  │
  ├── Frontend → Vercel / Netlify (static)
  └── Backend  → Railway / Render / Fly.io (Node.js server)
                        │
                        ▼
                   Supabase (cloud)
```

---

## Backend Deployment (Railway / Render)

1. Connect GitHub repo
2. Set root directory to `backend/`
3. Build command: *(none — it's plain Node.js)*
4. Start command: `npm start`
5. Add environment variables from `.env`
6. Deploy

The server listens on `process.env.PORT` — Render/Railway set this automatically.

---

## Frontend Deployment (Vercel)

1. Import GitHub repo
2. Framework preset: **Vite**
3. Root directory: `/` (project root)
4. Build command: `pnpm run build`
5. Output directory: `dist`
6. Add env var: `VITE_API_URL=https://your-backend.railway.app`
7. Deploy

> The frontend fetches from `GET /photos` via `VITE_API_URL` and polls every 15 seconds.

---

## CORS in Production

In `backend/src/app.js`, update the `ALLOWED_ORIGIN` env var to match the deployed frontend URL:

```
ALLOWED_ORIGIN=https://hmza.vercel.app
```

This replaces the wildcard `*` used in development.

---

## Related

- [[03 Tech Stack]]
- [[05 API]]
- [[08 Future Roadmap]]

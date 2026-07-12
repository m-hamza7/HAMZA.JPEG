# Backend — Setup

## Prerequisites

- Node.js ≥ 18
- npm
- A Supabase project (free tier works)

---

## First-Time Setup

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Supabase — Database

1. Open **Supabase Dashboard → SQL Editor → New Query**
2. Paste and run `backend/supabase_migration.sql`
3. Confirm the `photos` table appears in **Table Editor**

### 3. Supabase — Storage bucket

1. Dashboard → **Storage** → **New Bucket**
2. Name: `portfolio`
3. Toggle **Public bucket** ✅
4. Save

### 4. Get your API keys

| Key | Where to find |
|-----|---------------|
| `SUPABASE_URL` | Dashboard → Settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Dashboard → Settings → API → `service_role` (secret) |

### 5. Configure `.env`

**Backend** (`backend/.env`):
```
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
SUPABASE_BUCKET=portfolio
PORT=5000
```

**Frontend** (project root `.env`):
```
VITE_API_URL=http://localhost:5000
```

### 6. Run the server

```bash
npm run dev      # development — nodemon auto-restarts on file changes
npm start        # production
```

Server starts at: `http://localhost:5000`

---

## Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   └── supabase.js         ← Supabase client singleton
│   ├── controllers/
│   │   └── photoController.js  ← HTTP request handlers
│   ├── middleware/
│   │   ├── errorHandler.js     ← Centralised error → HTTP status
│   │   ├── upload.js           ← Multer config
│   │   └── validate.js         ← Input validation
│   ├── routes/
│   │   └── photoRoutes.js      ← Route → middleware → controller
│   ├── services/
│   │   └── photoService.js     ← All Supabase DB queries
│   ├── utils/
│   │   └── storage.js          ← Supabase Storage helpers
│   ├── app.js                  ← Express app factory
│   └── server.js               ← Entry point + graceful shutdown
├── supabase_migration.sql
├── .env                        ← Secret, gitignored
├── .env.example                ← Template
└── package.json
```

---

## Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `npm run dev` | nodemon src/server.js | Development with auto-restart |
| `npm start` | node src/server.js | Production start |

---

## Environment Variables

| Variable | Default | Required |
|----------|---------|----------|
| `SUPABASE_URL` | — | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | — | ✅ |
| `SUPABASE_BUCKET` | `portfolio` | ✅ |
| `PORT` | `5000` | Optional |
| `ALLOWED_ORIGIN` | `*` | Optional (restrict in prod) |

---

## Related

- [[Backend/Controllers]]
- [[Backend/Routes]]
- [[Backend/Storage]]
- [[04 Database]]

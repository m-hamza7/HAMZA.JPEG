# 00 — Project Overview

> **Hmza Gallery Automation** is a self-hosted pipeline for a mobile photography portfolio.  
> A photographer shoots on a phone → uploads images via a REST API (or later, n8n automation) → images appear in the React gallery.

---

## What This Project Is

A full-stack photography portfolio with an automated image pipeline:

- **Frontend** — React + Vite gallery (dark, tile-based, lightbox)
- **Backend** — Node.js / Express REST API
- **Storage** — Supabase Storage (S3-compatible)
- **Database** — Supabase PostgreSQL (`photos` table)
- **Future** — n8n automation to upload images on a schedule

---

## Project Structure

```
HMZA/
├── src/                    ← React frontend (Vite)
│   ├── components/
│   │   ├── Gallery.jsx
│   │   └── Lightbox.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
│
├── backend/                ← Express API
│   ├── src/
│   │   ├── config/         ← Supabase client
│   │   ├── controllers/    ← HTTP handlers
│   │   ├── middleware/     ← Multer, validation, error handler
│   │   ├── routes/         ← Express routers
│   │   ├── services/       ← DB operations
│   │   ├── utils/          ← Storage helpers
│   │   ├── app.js
│   │   └── server.js
│   └── supabase_migration.sql
│
└── Markdowns/
    └── Gallery Automation/ ← This vault
```

---

## Current Status

| Layer | Status |
|-------|--------|
| Frontend skeleton | ✅ Built |
| Backend API (MVP) | ✅ Built |
| Supabase schema | ⏳ Needs migration run |
| Supabase Storage bucket | ⏳ Needs creation |
| n8n automation | 🔜 Future |
| Production deployment | 🔜 Future |

---

## Quick Links

- [[01 Requirements]]
- [[02 Architecture]]
- [[03 Tech Stack]]
- [[04 Database]]
- [[05 API]]
- [[06 n8n Workflow]]
- [[07 Deployment]]
- [[08 Future Roadmap]]
- [[Backend/Setup]]
- [[Backend/Controllers]]
- [[Backend/Routes]]
- [[Backend/Storage]]
- [[Frontend/Components]]
- [[Frontend/Gallery]]

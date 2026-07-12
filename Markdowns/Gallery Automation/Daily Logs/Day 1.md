# Day 1 — Project Kickoff

**Date:** 2026-07-13  
**Status:** ✅ Complete

---

## What Was Done

### Frontend Scaffold
- Created React + Vite project (`mobile-photography-gallery`)
- Built dark tile-based gallery with placeholder image frames
- Implemented two sections: **Featured** (story cards) and **Gallery** (tile grid)
- Built `Gallery.jsx` — responsive tile grid with hover animations
- Built `Lightbox.jsx` — full-screen modal with prev/next navigation and story panel
- Styled with Vanilla CSS — dark navy palette (`#0b0d11` bg, `#5aa0ff` accent)
- Font: Manrope / Space Grotesk
- Added responsive breakpoint at 720px

### Backend MVP
- Scaffolded `backend/` folder inside the project
- Built full Express API with modular architecture:
  - `config/supabase.js` — Supabase singleton (service-role)
  - `middleware/upload.js` — Multer v2, memory storage, MIME whitelist, 15 MB cap
  - `middleware/validate.js` — file + category validation
  - `middleware/errorHandler.js` — centralised error → HTTP status
  - `routes/photoRoutes.js` — route wiring
  - `controllers/photoController.js` — HTTP handlers
  - `services/photoService.js` — all Supabase DB calls
  - `utils/storage.js` — UUID-path generation, upload, delete
  - `app.js` — Express factory
  - `server.js` — entry point with graceful shutdown
- Created `supabase_migration.sql` — photos table, index, RLS
- Upgraded multer → v2 (patched security), uuid → v11 (no deprecation)
- Confirmed `app.js loads cleanly`, 0 npm vulnerabilities

### Documentation
- Created Obsidian vault structure in `Markdowns/Gallery Automation/`
- Filled all 9 top-level docs + 4 Backend + 2 Frontend docs
- Created 30-day daily log structure

### Git / GitHub
- Initialised local git repo
- Pushed to `github.com/m-hamza7/HAMZA.JPEG`
- Resolved unrelated histories merge issue (`--allow-unrelated-histories`)

---

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Multer memory storage | No temp files; buffer streams directly to Supabase |
| Service-role key | Server-side only; bypasses RLS safely |
| Separate `app.js` / `server.js` | Testability — app can be imported without starting a server |
| UUID filename prefix | Guaranteed uniqueness in storage bucket |
| Non-fatal storage delete error | DB record deletion is critical; orphaned files can be cleaned up later |

---

## Blockers / Pending

- [ ] Fill in real Supabase credentials in `backend/.env`
- [ ] Run `supabase_migration.sql` in Supabase SQL Editor
- [ ] Create `portfolio` bucket in Supabase Storage (set to Public)
- [ ] Wire frontend `App.jsx` to fetch real data from `GET /photos`

---

## Tomorrow

- Set up Supabase project and run migration
- Test upload with cURL or Postman
- Begin connecting the frontend to the real API

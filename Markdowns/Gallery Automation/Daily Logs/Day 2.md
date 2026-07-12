# Day 2 — Supabase, Backend Completion & Frontend Wiring

**Date:** 2026-07-13  
**Status:** ✅ Complete

---

## What Was Done

### Supabase Setup
- Filled `backend/supabase_migration.sql` with full migration (table, index, RLS)
- Configured `backend/.env` with `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- Created `portfolio` storage bucket (public)
- Ran migration in Supabase SQL Editor

### Backend Completion
- Created missing files that were referenced but not present:
  - `src/app.js`, `src/server.js`
  - `src/middleware/upload.js`, `validate.js`, `errorHandler.js`
  - `src/services/photoService.js`, `src/utils/storage.js`
- Verified server starts at `http://localhost:5000`
- Tested `GET /health` — confirmed OK
- Uploaded test photo (`IMG_8504.PNG`, category: Street) via multipart form

### Frontend ↔ Backend Wiring
- Added root `.env` with `VITE_API_URL=http://localhost:5000`
- `App.jsx` fetches `GET /photos` on mount, polls every 15 seconds
- `Gallery.jsx` renders real `<img>` tags from `public_url`
- `Lightbox.jsx` shows real images in full-screen modal

### Phone-Style Gallery Grid
- Replaced placeholder tiles with a fixed **30-slot grid** (3 columns, square cells)
- Uploaded photos fill slots; remaining slots are dark empty cells
- Category label fades in on tile hover
- Lightbox prev/next navigates only through real photos

### Featured Stories (DB + API + Frontend)
- Added 3 columns to `photos` table: `is_featured`, `caption`, `story`
- Updated `photoService.js` — SELECT and INSERT include new fields
- Updated `photoController.js` — extracts optional fields from `req.body`
- Featured section now dynamic: `photos.filter(p => p.is_featured)`
- Uploaded featured test photo with caption and story — confirmed in API response

### Documentation
- Updated all vault markdown files to reflect current implementation

---

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| 30-slot fixed grid | Phone gallery feel; empty cells show room for growth |
| 15 s polling | Simple live updates without WebSockets |
| `is_featured` boolean | Clean filter for Featured vs Gallery sections |
| Featured photos also in Gallery | All uploads visible in archive; Featured is a curated subset |
| `is_featured` as string `"true"` in form data | Multipart forms send strings; controller normalises to boolean |

---

## Blockers / Issues

- PowerShell `curl` is an alias for `Invoke-WebRequest` — used raw multipart body for uploads instead
- Vite may bind to port 5175+ if 5173/5174 are in use

---

## Tomorrow

- Upload more photos (mix of featured and gallery)
- Begin n8n workflow setup
- Consider production deployment prep

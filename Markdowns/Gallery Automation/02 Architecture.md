# 02 — Architecture

## System Overview

```
                   ┌─────────────┐
  Browser / n8n ──▶│  Express API │ :5000
                   └──────┬──────┘
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
     ┌─────────────────┐    ┌──────────────────┐
     │ Supabase Postgres│    │ Supabase Storage  │
     │   (photos table) │    │  (portfolio bucket│
     └─────────────────┘    └──────────────────┘
              │
              ▼
     ┌─────────────────┐
     │  React Frontend  │ (Vite, :5173)
     │  reads public_url│
     └─────────────────┘
```

---

## Request Flow — Upload

```
Client (multipart/form-data)
  │
  ▼
POST /photos/upload
  │
  ├─▶ upload.js (Multer)      → validate MIME type, max size, keep in memory
  ├─▶ validate.js             → ensure file + category present
  ├─▶ photoController.js      → extract req.file + req.body (category, is_featured, caption, story)
  ├─▶ photoService.js         → orchestrate upload + DB insert
  │     ├─▶ utils/storage.js  → build UUID path, upload buffer to Supabase Storage
  │     └─▶ supabase DB       → INSERT into photos table
  └─▶ 201 JSON (inserted record)
```

## Request Flow — Get All

```
GET /photos
  │
  ├─▶ photoController.js → photoService.getAllPhotos()
  ├─▶ supabase DB        → SELECT id, public_url, category, is_featured, caption, story, created_at
  │                          ORDER BY created_at DESC
  └─▶ 200 JSON array
```

## Frontend Data Flow

```
GET /photos (polled every 15 s)
  │
  ├─▶ All photos        → Gallery grid (30 fixed slots, empty cells for unfilled)
  └─▶ is_featured=true → Featured feed (caption + story lightbox)
```

## Request Flow — Delete

```
DELETE /photos/:id
  │
  ├─▶ photoController.js → UUID format guard
  ├─▶ photoService.deletePhoto(id)
  │     ├─▶ supabase DB       → SELECT storage_path WHERE id = :id
  │     ├─▶ supabase DB       → DELETE WHERE id = :id
  │     └─▶ utils/storage.js  → remove([storage_path])
  └─▶ 200 JSON { message, id }
```

---

## Layer Responsibilities

| Layer | File | Responsibility |
|-------|------|----------------|
| Config | `config/supabase.js` | Singleton Supabase client (service-role) |
| Middleware | `middleware/upload.js` | Multer: memory storage, MIME filter, size cap |
| Middleware | `middleware/validate.js` | Business-level input checks |
| Middleware | `middleware/errorHandler.js` | Centralised error → HTTP status mapping |
| Routes | `routes/photoRoutes.js` | URL → middleware chain → controller |
| Controller | `controllers/photoController.js` | Parse req, call service, return res |
| Service | `services/photoService.js` | All Supabase DB queries |
| Utils | `utils/storage.js` | Supabase Storage upload / delete |
| Entry | `app.js` + `server.js` | Express factory + HTTP server |

---

## Design Decisions

### Why memory storage (not disk)?
Files are received as a Buffer and streamed directly to Supabase Storage. No temp files = no cleanup needed and works on stateless servers.

### Why service-role key?
The backend owns all DB access. The service-role key bypasses Row-Level Security, which is appropriate for a server-side process. The key is **never** sent to the browser.

### Why separate `app.js` and `server.js`?
`app.js` exports the Express app, making it independently testable without starting an HTTP server. `server.js` is only the entry point.

### Why UUID-prefixed filenames?
Guarantees uniqueness in the storage bucket even if the same file is uploaded twice. No collision possible.

---

## Related

- [[03 Tech Stack]]
- [[Backend/Setup]]
- [[Backend/Storage]]

# 08 — Future Roadmap

> Tracks planned features beyond the current working MVP.

---

## Completed (since Day 1)

| Feature | Status |
|---------|--------|
| Frontend ↔ Backend wiring | ✅ `GET /photos`, 15 s polling |
| `caption` / `story` / `is_featured` columns | ✅ In DB + API + frontend |
| Dynamic Featured section | ✅ Filtered from API |
| Phone-style gallery grid | ✅ 30 slots, empty cells |

---

## Phase 2 — Automation & Production

| Feature | Description | Priority |
|---------|-------------|----------|
| n8n workflow | Auto-upload from folder / Google Drive | High |
| API key auth | Secure the upload endpoint with a Bearer token | High |
| Production deployment | Backend on Railway/Render, frontend on Vercel | High |
| CORS lockdown | Restrict `ALLOWED_ORIGIN` to production domain | Medium |

---

## Phase 3 — Content Enrichment

| Feature | Description | Priority |
|---------|-------------|----------|
| Category filtering | Filter gallery by category on the frontend | Medium |
| Instagram import | OAuth import of existing Instagram photos | Low |
| `PATCH /photos/:id` | Edit category, caption, story, featured flag | Medium |

---

## Phase 4 — AI Features

| Feature | Description | Priority |
|---------|-------------|----------|
| AI auto-caption | Use GPT-4 Vision to generate captions on upload | Medium |
| AI hashtag generation | Extract relevant tags from image content | Low |
| Similarity search | Find visually similar photos using embeddings | Low |
| `ai_metadata` column | `jsonb` column to store AI outputs | Medium |

---

## Phase 5 — Admin & Management

| Feature | Description | Priority |
|---------|-------------|----------|
| Admin panel | Web UI to manage/delete photos | Medium |
| Bulk upload | Upload multiple photos in one request | Medium |
| Image ordering | Drag-and-drop sort order (add `sort_order` column) | Low |
| User authentication | Protect the admin panel with login | Medium |
| Soft deletes | `deleted_at` column instead of hard delete | Low |

---

## Technical Debt & Improvements

- [ ] Add unit tests (Jest + Supertest) for all three endpoints
- [ ] Add integration tests against a test Supabase project
- [ ] Add request logging middleware (Morgan)
- [ ] Add rate limiting (express-rate-limit) on upload endpoint
- [ ] Serve optimised WebP thumbnails instead of raw originals

---

## Related

- [[00 Overview]] — current status
- [[06 n8n Workflow]] — Phase 2 automation plan
- [[04 Database]] — future schema additions

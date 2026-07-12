# 01 — Requirements

## MVP Scope (Version 1)

The MVP covers **image upload, gallery retrieval, featured stories, and deletion**.

### ✅ In Scope

- Upload images via a REST API endpoint (`POST /photos/upload`)
- Store images in Supabase Storage (`portfolio` bucket)
- Save metadata (filename, URL, category, timestamp) to a PostgreSQL table
- Optional featured-story fields: `is_featured`, `caption`, `story`
- Retrieve all photos ordered by newest first (`GET /photos`)
- Delete a photo and its storage file (`DELETE /photos/:id`)
- Reject invalid uploads (wrong MIME type, too large, missing category)
- Frontend gallery wired to the API with live polling
- Featured section driven by `is_featured = true` photos
- Modular codebase ready for n8n integration

### ❌ Out of Scope (MVP)

| Feature | Reason deferred |
|---------|-----------------|
| Instagram integration | Requires OAuth, Phase 2 |
| AI captioning | Phase 4 feature |
| User authentication | Not needed until multi-user |
| Image editing / cropping | Out of scope |
| Hashtag fields | Not in DB schema yet |
| `PATCH /photos/:id` | Phase 5 admin feature |

---

## Functional Requirements

### Upload
- Accept `multipart/form-data` with fields:
  - `image` (file) — **required**
  - `category` (string) — **required**
  - `is_featured` (string) — optional, `"true"` marks as featured
  - `caption` (string) — optional, shown under featured card
  - `story` (string) — optional, shown in featured lightbox
- Validate: image MIME type only, max 15 MB, non-empty category
- Generate a UUID-prefixed unique filename before storing
- Return the full inserted record on success

### Retrieval
- Return all photos as JSON, newest first
- Fields: `id`, `public_url`, `category`, `is_featured`, `caption`, `story`, `created_at`
- Frontend splits the response:
  - **Gallery** — all photos
  - **Featured** — photos where `is_featured = true`

### Deletion
- Accept a UUID as a URL parameter
- Delete the database row **and** the corresponding file from storage
- Return `200` with confirmation message

---

## Non-Functional Requirements

- Response time < 500 ms for GET (excluding network latency)
- Centralised error handling — no raw stack traces to clients
- No secrets in source control (`.env` gitignored)
- Ready for n8n HTTP Request node without any code changes
- Frontend polls `GET /photos` every 15 seconds for live updates

---

## Validation Rules

| Condition | HTTP Status |
|-----------|-------------|
| No file attached | 400 |
| File is not an image | 415 |
| File exceeds 15 MB | 413 |
| Category is missing or blank | 400 |
| `:id` is not a valid UUID | 400 |
| Photo with `:id` not found | 404 |
| Supabase / upstream error | 502 |

---

## Related

- [[02 Architecture]] — how the pieces connect
- [[05 API]] — full endpoint reference

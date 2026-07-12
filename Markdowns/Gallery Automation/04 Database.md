# 04 — Database

## Table: `photos`

Stores metadata for every uploaded image. The actual file lives in Supabase Storage; this table holds the reference to it.

### Schema

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PRIMARY KEY, default `uuid_generate_v4()` | Unique identifier |
| `filename` | `text` | NOT NULL | Original filename from the client |
| `storage_path` | `text` | NOT NULL, UNIQUE | Path inside the `portfolio` bucket |
| `public_url` | `text` | NOT NULL | Full public CDN URL of the image |
| `category` | `text` | NOT NULL | User-supplied category (e.g. "Street") |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | Upload timestamp |
| `is_featured` | `boolean` | NOT NULL, default `false` | Whether photo appears in Featured section |
| `caption` | `text` | nullable | Short caption under featured card |
| `story` | `text` | nullable | Long narrative shown in featured lightbox |

### Indexes

```sql
CREATE INDEX photos_created_at_desc ON public.photos (created_at DESC);
```

Optimises the `GET /photos` query which orders by `created_at DESC`.

---

## Running the Migration

1. Open **Supabase Dashboard → SQL Editor → New Query**
2. Paste the contents of `backend/supabase_migration.sql`
3. Click **Run**

The migration is idempotent — it uses `CREATE TABLE IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS`, and `ADD COLUMN IF NOT EXISTS`.

---

## Migration SQL (Reference)

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.photos (
  id           uuid         PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename     text         NOT NULL,
  storage_path text         NOT NULL UNIQUE,
  public_url   text         NOT NULL,
  category     text         NOT NULL,
  created_at   timestamptz  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS photos_created_at_desc
  ON public.photos (created_at DESC);

ALTER TABLE public.photos
  ADD COLUMN IF NOT EXISTS is_featured boolean     NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS caption     text,
  ADD COLUMN IF NOT EXISTS story       text;

ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
```

---

## Row-Level Security (RLS)

RLS is **enabled** on the table. The backend uses the **service-role key** which bypasses RLS entirely. This means:

- The Express API has full read/write/delete access
- Anonymous or authenticated Supabase clients cannot access the table directly
- This is correct and intentional — all data access goes through the API

---

## Supabase Storage Bucket

| Setting | Value |
|---------|-------|
| Bucket name | `portfolio` |
| Visibility | **Public** (images are served via public CDN URLs) |
| Path format | `<uuid>-<sanitised-filename>.<ext>` |

### Creating the bucket

1. Supabase Dashboard → **Storage** → **New Bucket**
2. Name: `portfolio`
3. Toggle: **Public bucket** ✅
4. Click **Save**

---

## Frontend Usage

| Column | Gallery section | Featured section |
|--------|----------------|------------------|
| `public_url` | Tile image + lightbox | Card image + lightbox |
| `category` | Tile label + lightbox meta | Card title |
| `is_featured` | — | Filter: `is_featured = true` |
| `caption` | — | Text below featured card |
| `story` | — | Right panel in featured lightbox |

---

## Future Schema Additions

- `hashtags` (text[]) — array of tags
- `instagram_id` (text) — link to the original Instagram post
- `ai_metadata` (jsonb) — AI-generated tags / descriptions
- `sort_order` (integer) — manual gallery ordering

---

## Related

- [[05 API]] — how data flows in and out
- [[02 Architecture]] — storage + DB relationship
- [[Backend/Storage]]

# Backend — Storage

Files:
- `backend/src/utils/storage.js` — Supabase Storage helpers
- `backend/src/config/supabase.js` — Supabase client

---

## Overview

All Supabase Storage operations are encapsulated in `utils/storage.js`. The rest of the codebase never imports the Supabase client directly for storage — it always goes through these helpers.

---

## `buildStoragePath(originalName)`

Generates a unique, safe filename for the storage bucket.

```js
const buildStoragePath = (originalName) => {
  const ext = path.extname(originalName).toLowerCase();
  const base = path
    .basename(originalName, ext)
    .replace(/[^a-z0-9]/gi, '-')
    .toLowerCase()
    .slice(0, 60);

  return `${uuidv4()}-${base}${ext}`;
};
```

**Examples:**

| Input | Output |
|-------|--------|
| `photo.jpg` | `550e8400-...-photo.jpg` |
| `My Photo (1).JPEG` | `550e8400-...-my-photo--1-.jpeg` |
| `IMG_20240601_123456.png` | `550e8400-...-img-20240601-123456.png` |

**Why:**
- UUID prefix guarantees uniqueness — no collisions even if the same file is uploaded twice
- Sanitised base name avoids special characters in storage paths
- Extension is lowercased for consistency

---

## `uploadToStorage(buffer, mimetype, originalName)`

Uploads a file buffer to the `portfolio` bucket.

```js
const uploadToStorage = async (buffer, mimetype, originalName) => {
  const storagePath = buildStoragePath(originalName);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, buffer, { contentType: mimetype, upsert: false });

  if (error) throw Object.assign(new Error(`Storage upload failed: ${error.message}`), { status: 502 });

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return { storagePath, publicUrl: data.publicUrl };
};
```

**Notes:**
- `upsert: false` — never silently overwrite. UUIDs make collisions impossible anyway.
- Returns both `storagePath` (for the DB) and `publicUrl` (for the client)
- The public URL only works if the bucket is set to **Public**

---

## `deleteFromStorage(storagePath)`

Removes a file from the bucket.

```js
const deleteFromStorage = async (storagePath) => {
  const { error } = await supabase.storage.from(BUCKET).remove([storagePath]);
  if (error) {
    console.error(`[storage] Failed to delete "${storagePath}":`, error.message);
  }
};
```

**Notes:**
- Takes an array — `remove([storagePath])`
- Failure is **non-fatal** — it logs but does not throw
- Reason: the DB record deletion is the critical step. If the file lingers in storage, it can be cleaned up manually or via a future maintenance job.

---

## Supabase Client (`config/supabase.js`)

```js
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
```

- Uses the **service-role key** (not the anon key)
- Session persistence is disabled — this is a server-side client, not a browser
- Exported as a singleton — one client for the entire backend lifetime

---

## Bucket Configuration

| Setting | Value |
|---------|-------|
| Bucket name | `portfolio` |
| Visibility | Public |
| File path format | `<uuid>-<safe-basename>.<ext>` |
| Max file size (enforced by Multer) | 15 MB |

---

## Related

- [[04 Database]] — where `storage_path` and `public_url` are stored
- [[Backend/Setup]] — bucket creation steps
- [[02 Architecture]] — full upload flow diagram

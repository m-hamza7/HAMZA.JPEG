# 05 — API Reference

Base URL (development): `http://localhost:5000`

---

## Endpoints

### GET `/health`

Health check — confirms the server is running.

**Response `200`**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### GET `/photos`

Returns all photos ordered by **newest first**.

**Response `200`**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "public_url": "https://xyz.supabase.co/storage/v1/object/public/portfolio/abc-photo.jpg",
    "category": "Street",
    "is_featured": true,
    "caption": "A quiet street, caught in the in-between hour.",
    "story": "This was taken on a mid-week afternoon when the lane was almost empty...",
    "created_at": "2024-06-01T10:00:00.000Z"
  }
]
```

**Notes**
- Returns 7 fields (not `filename` or `storage_path`)
- `is_featured` defaults to `false`; `caption` and `story` may be `null`
- Empty array `[]` if no photos exist
- Frontend filters `is_featured = true` for the Featured section

---

### POST `/photos/upload`

Upload a new photo to the gallery.

**Content-Type:** `multipart/form-data`

**Fields**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `image` | File | ✅ | Must be an image (jpeg, png, webp, gif, avif, heic) |
| `category` | String | ✅ | Cannot be blank. E.g. `Street`, `Portrait`, `Architecture` |
| `is_featured` | String | ❌ | Set to `"true"` to show in Featured section |
| `caption` | String | ❌ | Short caption under featured card |
| `story` | String | ❌ | Long narrative in featured lightbox |

**Response `201`** — full inserted record
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "filename": "photo.jpg",
  "storage_path": "abc123-photo.jpg",
  "public_url": "https://xyz.supabase.co/storage/v1/object/public/portfolio/abc123-photo.jpg",
  "category": "Street",
  "is_featured": true,
  "caption": "A quiet street, caught in the in-between hour.",
  "story": "This was taken on a mid-week afternoon...",
  "created_at": "2024-06-01T10:00:00.000Z"
}
```

**cURL Example — standard upload**
```bash
curl -X POST http://localhost:5000/photos/upload \
  -F "image=@/path/to/photo.jpg" \
  -F "category=Street"
```

**cURL Example — featured upload**
```bash
curl -X POST http://localhost:5000/photos/upload \
  -F "image=@/path/to/photo.jpg" \
  -F "category=Street" \
  -F "is_featured=true" \
  -F "caption=A quiet street, caught in the in-between hour." \
  -F "story=This was taken on a mid-week afternoon when the lane was almost empty..."
```

**Error Responses**

| Condition | Status | Message |
|-----------|--------|---------|
| No file | 400 | `"No image file provided."` |
| Wrong MIME type | 415 | `"Only image files are accepted."` |
| File > 15 MB | 413 | `"Image exceeds the maximum allowed size of 15 MB."` |
| Missing category | 400 | `"Category is required and cannot be empty."` |
| Supabase error | 502 | `"Storage upload failed: ..."` |

---

### DELETE `/photos/:id`

Delete a photo by its UUID. Removes both the database record and the file from Supabase Storage.

**URL Parameter**

| Param | Type | Description |
|-------|------|-------------|
| `:id` | UUID string | The `id` of the photo to delete |

**Response `200`**
```json
{
  "message": "Photo deleted successfully.",
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**cURL Example**
```bash
curl -X DELETE http://localhost:5000/photos/550e8400-e29b-41d4-a716-446655440000
```

**Error Responses**

| Condition | Status | Message |
|-----------|--------|---------|
| Invalid UUID format | 400 | `"Invalid photo ID format."` |
| Not found | 404 | `"Photo not found."` |
| DB error | 502 | `"Failed to delete photo record: ..."` |

---

## Error Response Shape

All errors follow the same JSON shape:
```json
{
  "error": "Human-readable error message."
}
```

---

## n8n Integration

Point an **HTTP Request** node at `POST /photos/upload`:

| Setting | Value |
|---------|-------|
| Method | POST |
| URL | `http://your-server:5000/photos/upload` |
| Body Content Type | Form-Data/Multipart |
| Field `image` | Binary file input |
| Field `category` | Expression or static string |
| Field `is_featured` | `"true"` (optional) |
| Field `caption` | String (optional) |
| Field `story` | String (optional) |

No backend changes are required when n8n is connected.

---

## Related

- [[02 Architecture]] — request flow diagrams
- [[06 n8n Workflow]] — automation setup
- [[Backend/Controllers]]
- [[Backend/Routes]]

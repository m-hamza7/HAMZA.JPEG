# 06 — n8n Workflow

> **Status:** 🔜 Planned for Phase 2. The backend API is already designed to support this — no backend changes needed.

---

## Overview

n8n will automate the image upload pipeline. Instead of manually calling the API, a workflow will watch a folder (or Google Drive, etc.) and automatically upload new images to the gallery.

---

## Planned Workflow: Folder Watch → Upload

```
[Trigger: Folder / Drive watch]
        │
        ▼
[Read new image file]
        │
        ▼
[HTTP Request Node]
  POST http://your-server:5000/photos/upload
  Body: multipart/form-data
    - image: (binary file)
    - category: (expression or static)
        │
        ▼
[Success → Log / Notify]
[Error   → Alert]
```

---

## HTTP Request Node Configuration

| Setting | Value |
|---------|-------|
| Node type | HTTP Request |
| Method | `POST` |
| URL | `http://localhost:5000/photos/upload` (dev) |
| Authentication | None (MVP) |
| Body Content Type | **Multipart Form Data** |

**Form fields:**

| Key | Type | Value |
|-----|------|-------|
| `image` | Binary | `{{ $binary.data }}` |
| `category` | String | `"Street"` or dynamic expression |

---

## Trigger Options (to evaluate in Phase 2)

| Trigger | Pros | Cons |
|---------|------|------|
| Local folder watch | Simple, no OAuth | Machine must be running |
| Google Drive trigger | Works from phone | Requires OAuth setup |
| Webhook | Maximum flexibility | Needs a sender |
| Schedule + SFTP | Reliable | More setup |

---

## Error Handling in n8n

- Add an **Error Trigger** node to catch failed HTTP requests
- Log failures to a file or send a Telegram/email notification
- The backend returns structured JSON errors — use the `error` field from the response

---

## Security Considerations (Phase 2)

When the backend is publicly deployed:
- Add an `API_KEY` environment variable to the backend
- n8n sends the key as an `Authorization: Bearer <key>` header
- Backend middleware validates the key before processing

This requires **one additional middleware** — no route or service changes.

---

## Related

- [[05 API]] — the endpoint n8n calls
- [[07 Deployment]] — where the backend will be hosted
- [[08 Future Roadmap]]

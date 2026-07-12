# Hmza Gallery — Backend API (MVP)

Node.js / Express backend for the Hmza mobile photography gallery.  
Handles image uploads, metadata storage, and retrieval via Supabase.

---

## Quick Start

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Set up Supabase

#### Database
1. Open **Supabase Dashboard → SQL Editor → New Query**
2. Paste and run `supabase_migration.sql`

#### Storage bucket
1. Open **Dashboard → Storage → New Bucket**
2. Name it `portfolio` — set it to **Public**

#### Get your keys
- `SUPABASE_URL` → Dashboard → Settings → API → Project URL  
- `SUPABASE_SERVICE_ROLE_KEY` → Dashboard → Settings → API → `service_role` (secret)

### 3. Configure environment
```bash
cp .env.example .env
# Edit .env and fill in your real values
```

### 4. Run the server
```bash
npm run dev     # development (nodemon)
npm start       # production
```

---

## REST API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/photos` | List all photos (newest first) |
| `POST` | `/photos/upload` | Upload an image + category |
| `DELETE` | `/photos/:id` | Delete a photo by UUID |
| `GET` | `/health` | Health check |

### GET /photos
```json
[
  {
    "id": "uuid",
    "public_url": "https://...",
    "category": "Street",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### POST /photos/upload
**Content-Type:** `multipart/form-data`

| Field | Type | Required |
|-------|------|----------|
| `image` | file (image/*) | ✅ |
| `category` | string | ✅ |

```bash
curl -X POST http://localhost:5000/photos/upload \
  -F "image=@/path/to/photo.jpg" \
  -F "category=Street"
```

### DELETE /photos/:id
```bash
curl -X DELETE http://localhost:5000/photos/550e8400-e29b-41d4-a716-446655440000
```

---

## Validation Rules

| Rule | Behaviour |
|------|-----------|
| No file provided | `400 Bad Request` |
| File is not an image | `415 Unsupported Media Type` |
| File > 15 MB | `413 Payload Too Large` |
| Category is empty | `400 Bad Request` |
| ID not a valid UUID | `400 Bad Request` |
| Photo not found | `404 Not Found` |

---

## Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   └── supabase.js        # Supabase client (service-role)
│   ├── controllers/
│   │   └── photoController.js # HTTP request/response handlers
│   ├── middleware/
│   │   ├── errorHandler.js    # Centralised error handling
│   │   ├── upload.js          # Multer (MIME + size validation)
│   │   └── validate.js        # Business-level request validation
│   ├── routes/
│   │   └── photoRoutes.js     # Route → middleware → controller wiring
│   ├── services/
│   │   └── photoService.js    # Supabase DB operations
│   ├── utils/
│   │   └── storage.js         # Supabase Storage helpers
│   ├── app.js                 # Express app factory
│   └── server.js              # HTTP server entry point
├── supabase_migration.sql     # Run once in Supabase SQL Editor
├── .env                       # Secret — not committed
├── .env.example               # Template
└── package.json
```

---

## n8n Automation Compatibility

The `POST /photos/upload` endpoint accepts standard `multipart/form-data`.  
Point your n8n HTTP Request node at `http://your-server:5000/photos/upload` with:

- **Method**: POST  
- **Body Type**: Form Data  
- **Fields**: `image` (binary file), `category` (string)

No backend changes needed when automation is added.

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Project URL from Supabase dashboard |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret service-role key (never expose to browser) |
| `SUPABASE_BUCKET` | Storage bucket name (default: `portfolio`) |
| `PORT` | Server port (default: `5000`) |
| `ALLOWED_ORIGIN` | CORS origin (default: `*`, restrict in production) |

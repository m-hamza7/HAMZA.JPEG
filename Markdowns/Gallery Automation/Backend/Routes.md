# Backend — Routes

File: `backend/src/routes/photoRoutes.js`

The routes file is the **wiring layer** — it connects URL patterns to middleware chains and controllers. No logic lives here.

---

## Route Definitions

```js
const router = Router();

router.get('/', getPhotos);

router.post(
  '/upload',
  upload.single('image'),   // 1. Multer: parse multipart, validate MIME + size
  validateUpload,           // 2. Ensure file + category present
  uploadPhoto               // 3. Upload to storage + insert DB record
);

router.delete('/:id', deletePhoto);

module.exports = router;
```

Mounted in `app.js` at `/photos`:

```js
app.use('/photos', photoRoutes);
```

So the full paths are:
- `GET  /photos`
- `POST /photos/upload`
- `DELETE /photos/:id`

---

## Middleware Chain — Upload

The upload route uses a 3-step middleware chain before the controller:

```
Request
  │
  ▼
upload.single('image')         ← Multer parses multipart/form-data
  │   Rejects: wrong MIME type (415), file too large (413)
  ▼
validateUpload                 ← Checks req.file exists + category non-empty
  │   Rejects: no file (400), no category (400)
  ▼
uploadPhoto (controller)       ← Executes the actual business logic
```

This chain ensures that by the time `uploadPhoto` runs, all input is guaranteed valid.

---

## Why `upload.single('image')`?

The field name `'image'` **must match** what the client sends in the form data.  
n8n, cURL, and any HTTP client must use `image` as the file field name.

---

## Health Check & 404

These are defined directly in `app.js`, not in the routes file:

```js
app.get('/health', (_req, res) => res.status(200).json({ status: 'ok', ... }));

app.use((_req, res) => res.status(404).json({ error: 'Route not found.' }));
```

---

## Related

- [[Backend/Controllers]] — what runs at the end of each chain
- [[05 API]] — full endpoint documentation
- [[Backend/Setup]] — file location

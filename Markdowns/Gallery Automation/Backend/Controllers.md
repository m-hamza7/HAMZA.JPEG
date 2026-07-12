# Backend — Controllers

File: `backend/src/controllers/photoController.js`

Controllers are **thin HTTP handlers**. Their only job is to:
1. Extract data from `req`
2. Call the appropriate service function
3. Return the HTTP response
4. Forward errors to `next(err)` for the centralised error handler

No business logic, no DB calls, no storage operations belong here.

---

## `getPhotos`

Handles `GET /photos`.

```js
const getPhotos = async (req, res, next) => {
  try {
    const photos = await photoService.getAllPhotos();
    return res.status(200).json(photos);
  } catch (err) {
    next(err);
  }
};
```

**Flow:**
- Calls `photoService.getAllPhotos()`
- Returns the array as JSON with status `200`
- Any error is forwarded to the error handler

---

## `uploadPhoto`

Handles `POST /photos/upload`.

By the time this runs, Multer and `validateUpload` middleware have already:
- Parsed the multipart body
- Validated the MIME type and file size
- Confirmed `req.file` and `req.body.category` exist

```js
const uploadPhoto = async (req, res, next) => {
  try {
    const { buffer, mimetype, originalname } = req.file;
    const { category } = req.body;

    const photo = await photoService.uploadPhoto(buffer, mimetype, originalname, category);
    return res.status(201).json(photo);
  } catch (err) {
    next(err);
  }
};
```

**Flow:**
- Destructures file properties from `req.file`
- Passes them to `photoService.uploadPhoto()`
- Returns the inserted record with status `201`

---

## `deletePhoto`

Handles `DELETE /photos/:id`.

Includes a lightweight UUID format guard before hitting the database.

```js
const deletePhoto = async (req, res, next) => {
  try {
    const { id } = req.params;

    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidPattern.test(id)) {
      return res.status(400).json({ error: 'Invalid photo ID format.' });
    }

    await photoService.deletePhoto(id);
    return res.status(200).json({ message: 'Photo deleted successfully.', id });
  } catch (err) {
    next(err);
  }
};
```

**Flow:**
- Validates `:id` is a valid UUID (regex check)
- Calls `photoService.deletePhoto(id)`
- Returns `200` with a confirmation message

---

## Error Propagation

All three controllers use `try/catch` and call `next(err)` on failure.  
The error reaches `middleware/errorHandler.js` which maps it to an appropriate HTTP status.

Services throw errors with a `.status` property to communicate the intended HTTP code:
```js
throw Object.assign(new Error('Photo not found.'), { status: 404 });
```

---

## Related

- [[Backend/Routes]] — how controllers are wired to endpoints
- [[Backend/Setup]] — file location and project structure
- [[05 API]] — full endpoint documentation

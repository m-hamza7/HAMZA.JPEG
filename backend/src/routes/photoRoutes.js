/**
 * photoRoutes.js
 * Declares all /photos endpoints and wires up middleware chains.
 *
 * Middleware order matters:
 *   upload.single()  — multer parses multipart body and attaches req.file
 *   validateUpload   — checks file presence and category
 *   controller       — executes business logic
 */

const { Router } = require('express');
const upload = require('../middleware/upload');
const { validateUpload } = require('../middleware/validate');
const { getPhotos, uploadPhoto, deletePhoto } = require('../controllers/photoController');

const router = Router();

// GET /photos — list all photos (newest first)
router.get('/', getPhotos);

// POST /photos/upload — upload a new photo
// The multer field name must be 'image' (matches the API spec)
router.post(
  '/upload',
  upload.single('image'),   // 1. parse multipart, validate MIME & size
  validateUpload,           // 2. ensure file + category are present
  uploadPhoto               // 3. upload to storage + insert DB record
);

// DELETE /photos/:id — remove a photo and its storage file
router.delete('/:id', deletePhoto);

module.exports = router;

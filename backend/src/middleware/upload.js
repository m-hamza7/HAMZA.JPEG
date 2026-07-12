/**
 * upload.js
 * Multer configuration for handling multipart/form-data image uploads.
 *
 * - Memory storage: file buffer is streamed directly to Supabase; no temp files on disk.
 * - MIME filter:    only image/* types are accepted at the parser level.
 * - Size limit:     15 MB hard cap enforced by Multer before the controller is reached.
 */

const multer = require('multer');

const ACCEPTED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/heic',
]);

const MAX_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB

const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  if (ACCEPTED_MIME_TYPES.has(file.mimetype)) {
    cb(null, true);
  } else {
    // Passing an error here causes Multer to reject and propagate to errorHandler
    const err = Object.assign(
      new Error('Only image files are accepted.'),
      { status: 415 }
    );
    cb(err, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE_BYTES },
});

module.exports = upload;

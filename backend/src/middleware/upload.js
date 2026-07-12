/**
 * upload.js  (middleware)
 * Configures multer for in-memory file handling.
 *
 * Rules enforced here (before the request hits the controller):
 *   • Only image MIME types are accepted.
 *   • Maximum file size: 15 MB.
 *
 * The file is kept in memory (Buffer) so it can be streamed directly to
 * Supabase Storage without writing a temp file to disk.
 */

const multer = require('multer');

// ─── Accepted MIME types ───────────────────────────────────────────────────
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/heic',
  'image/heif',
];

// ─── Max size: 15 MB ──────────────────────────────────────────────────────
const MAX_SIZE_BYTES = 15 * 1024 * 1024;

// ─── File filter ──────────────────────────────────────────────────────────
const fileFilter = (_req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      Object.assign(new Error('Only image files are accepted.'), {
        status: 415,
      }),
      false
    );
  }
};

// ─── Multer instance ──────────────────────────────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE_BYTES },
  fileFilter,
});

module.exports = upload;

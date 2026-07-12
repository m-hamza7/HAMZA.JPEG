/**
 * errorHandler.js  (middleware)
 * Centralised Express error-handling middleware.
 * Must be registered LAST in app.js (after all routes).
 *
 * Handles:
 *   - Multer-specific errors (file too large, wrong field name)
 *   - Custom errors with a `.status` property
 *   - Generic 500 fallback
 */

const multer = require('multer');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, _req, res, _next) => {
  console.error('[errorHandler]', err.message || err);

  // ── Multer: file too large ────────────────────────────────────────────────
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        error: 'Image exceeds the maximum allowed size of 15 MB.',
      });
    }
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }

  // ── Errors with an explicit HTTP status (e.g. from fileFilter) ───────────
  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }

  // ── Generic server error ──────────────────────────────────────────────────
  return res.status(500).json({
    error: 'An unexpected server error occurred. Please try again later.',
  });
};

module.exports = errorHandler;

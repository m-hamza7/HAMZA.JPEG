/**
 * errorHandler.js
 * Centralised Express error-handling middleware.
 * Must be registered last in app.js (after all routes).
 *
 * Errors thrown anywhere in the stack land here. Services attach a `.status`
 * property to errors so the correct HTTP code is returned without leaking
 * internal details to the client.
 */

const errorHandler = (err, _req, res, _next) => {
  // Multer-specific errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        error: 'Image exceeds the maximum allowed size of 15 MB.',
      });
    }
    return res.status(400).json({ error: err.message });
  }

  // Application errors with an explicit status attached
  const status = err.status || 500;

  // Log server-side errors for debugging; suppress stack traces in responses
  if (status >= 500) {
    console.error('[errorHandler]', err);
  }

  return res.status(status).json({ error: err.message || 'An unexpected error occurred.' });
};

module.exports = errorHandler;

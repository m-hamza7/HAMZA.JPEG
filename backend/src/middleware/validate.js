/**
 * validate.js  (middleware)
 * Request-level validation helpers used before controllers run.
 */

/**
 * validateUpload
 * Ensures the upload request has both a file and a non-empty category.
 * Must be placed AFTER the multer middleware in the route chain.
 */
const validateUpload = (req, res, next) => {
  // Multer attaches the file to req.file
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided.' });
  }

  const category = (req.body.category || '').trim();
  if (!category) {
    return res.status(400).json({ error: 'Category is required and cannot be empty.' });
  }

  // Normalise: attach trimmed category back to body so controllers can use it
  req.body.category = category;
  next();
};

module.exports = { validateUpload };

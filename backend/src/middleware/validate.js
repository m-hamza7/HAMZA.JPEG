/**
 * validate.js
 * Business-level input validation that runs after Multer has parsed the request.
 * Multer handles MIME type and file size; this middleware handles everything else.
 */

/**
 * Validates the upload request:
 *   - req.file must be present (Multer populates it)
 *   - req.body.category must be a non-empty string
 */
const validateUpload = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided.' });
  }

  const category = req.body.category?.trim();
  if (!category) {
    return res.status(400).json({ error: 'Category is required and cannot be empty.' });
  }

  // Normalise category back onto body so the controller uses the trimmed value
  req.body.category = category;

  next();
};

module.exports = { validateUpload };

/**
 * photoController.js
 * Thin controller layer — validates input, calls the service, returns HTTP responses.
 * No business logic or database calls belong here.
 */

const photoService = require('../services/photoService');

// ─── GET /photos ──────────────────────────────────────────────────────────────

/**
 * Returns all photos ordered by newest first.
 */
const getPhotos = async (req, res, next) => {
  try {
    const photos = await photoService.getAllPhotos();
    return res.status(200).json(photos);
  } catch (err) {
    next(err);
  }
};

// ─── POST /photos/upload ──────────────────────────────────────────────────────

/**
 * Accepts a multipart/form-data request with fields:
 *   - image    (file)
 *   - category (string)
 *
 * Note: file presence and category validation is handled upstream
 *       by the validate middleware — this controller assumes both exist.
 */
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

// ─── DELETE /photos/:id ───────────────────────────────────────────────────────

/**
 * Deletes a photo by its UUID.
 * Removes both the database record and the file from Supabase Storage.
 */
const deletePhoto = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Basic UUID format guard (prevents obviously malformed IDs from hitting the DB)
    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidPattern.test(id)) {
      return res.status(400).json({ error: 'Invalid photo ID format.' });
    }

    await photoService.deletePhoto(id);

    return res.status(200).json({ message: 'Photo deleted successfully.', id });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPhotos, uploadPhoto, deletePhoto };

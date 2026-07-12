/**
 * photoController.js
 * Thin controller layer — validates input, calls the service, returns HTTP responses.
 */

const photoService = require('../services/photoService');

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const guardUuid = (id, res) => {
  if (!UUID_PATTERN.test(id)) {
    res.status(400).json({ error: 'Invalid photo ID format.' });
    return false;
  }
  return true;
};

// ─── GET /photos ──────────────────────────────────────────────────────────────

const getPhotos = async (req, res, next) => {
  try {
    const photos = await photoService.getAllPhotos();
    return res.status(200).json(photos);
  } catch (err) {
    next(err);
  }
};

// ─── POST /photos/upload ──────────────────────────────────────────────────────

const uploadPhoto = async (req, res, next) => {
  try {
    const { buffer, mimetype, originalname } = req.file;
    const { category, is_featured, caption, story } = req.body;

    const photo = await photoService.uploadPhoto(
      buffer,
      mimetype,
      originalname,
      category,
      {
        isFeatured: is_featured === 'true',
        caption:    caption?.trim() || null,
        story:      story?.trim()   || null,
      }
    );

    return res.status(201).json(photo);
  } catch (err) {
    next(err);
  }
};

// ─── PATCH /photos/:id ────────────────────────────────────────────────────────

const patchPhoto = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!guardUuid(id, res)) return;

    const { category, caption, story, is_featured } = req.body;
    const fields = {};

    if (category !== undefined) {
      const trimmed = String(category).trim();
      if (!trimmed) {
        return res.status(400).json({ error: 'Category cannot be empty.' });
      }
      fields.category = trimmed;
    }
    if (caption !== undefined) fields.caption = caption?.trim() || null;
    if (story !== undefined) fields.story = story?.trim() || null;
    if (is_featured !== undefined) fields.is_featured = Boolean(is_featured);

    const photo = await photoService.updatePhoto(id, fields);
    return res.status(200).json(photo);
  } catch (err) {
    next(err);
  }
};

// ─── PATCH /photos/reorder ──────────────────────────────────────────────────

const reorderPhotos = async (req, res, next) => {
  try {
    const { gallery, featured } = req.body;

    if (!Array.isArray(gallery) && !Array.isArray(featured)) {
      return res.status(400).json({ error: 'Provide gallery and/or featured ID arrays.' });
    }

    const photos = await photoService.reorderPhotos({
      gallery: gallery || [],
      featured: featured || [],
    });

    return res.status(200).json(photos);
  } catch (err) {
    next(err);
  }
};

// ─── DELETE /photos/:id ───────────────────────────────────────────────────────

const deletePhoto = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!guardUuid(id, res)) return;

    await photoService.deletePhoto(id);
    return res.status(200).json({ message: 'Photo deleted successfully.', id });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPhotos, uploadPhoto, patchPhoto, reorderPhotos, deletePhoto };

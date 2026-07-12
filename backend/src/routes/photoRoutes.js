/**
 * photoRoutes.js
 * Declares all /photos endpoints and wires up middleware chains.
 */

const { Router } = require('express');
const upload = require('../middleware/upload');
const { validateUpload } = require('../middleware/validate');
const {
  getPhotos,
  uploadPhoto,
  patchPhoto,
  reorderPhotos,
  deletePhoto,
} = require('../controllers/photoController');

const router = Router();

router.get('/', getPhotos);

router.patch('/reorder', reorderPhotos);

router.post(
  '/upload',
  upload.single('image'),
  validateUpload,
  uploadPhoto
);

router.patch('/:id', patchPhoto);

router.delete('/:id', deletePhoto);

module.exports = router;

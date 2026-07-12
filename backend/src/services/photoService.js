/**
 * photoService.js
 * Data-access layer for the `photos` table.
 * All Supabase database calls live here — controllers stay thin.
 */

const supabase = require('../config/supabase');
const { uploadToStorage, deleteFromStorage } = require('../utils/storage');

// ─── Read ─────────────────────────────────────────────────────────────────────

/**
 * Fetches all photos ordered by newest first.
 * Returns only the columns the frontend needs.
 *
 * @returns {Promise<Array>}
 */
const getAllPhotos = async () => {
  const { data, error } = await supabase
    .from('photos')
    .select('id, public_url, category, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    throw Object.assign(
      new Error(`Failed to fetch photos: ${error.message}`),
      { status: 502 }
    );
  }

  return data;
};

// ─── Create ───────────────────────────────────────────────────────────────────

/**
 * Uploads an image to Supabase Storage and inserts a record into `photos`.
 *
 * @param {Buffer} buffer         - Raw image file data.
 * @param {string} mimetype       - MIME type (e.g. 'image/jpeg').
 * @param {string} originalName   - Original filename from the client.
 * @param {string} category       - User-supplied category (e.g. 'Street').
 * @returns {Promise<Object>}     - The inserted photo record.
 */
const uploadPhoto = async (buffer, mimetype, originalName, category) => {
  // 1. Upload file to Supabase Storage
  const { storagePath, publicUrl } = await uploadToStorage(buffer, mimetype, originalName);

  // 2. Insert metadata into the database
  const { data, error } = await supabase
    .from('photos')
    .insert({
      filename: originalName,
      storage_path: storagePath,
      public_url: publicUrl,
      category,
    })
    .select()
    .single();

  if (error) {
    // Best-effort cleanup: remove the orphaned file from storage
    await deleteFromStorage(storagePath);
    throw Object.assign(
      new Error(`Failed to save photo record: ${error.message}`),
      { status: 502 }
    );
  }

  return data;
};

// ─── Delete ───────────────────────────────────────────────────────────────────

/**
 * Deletes a photo record from the database and its file from Supabase Storage.
 *
 * @param {string} id  - UUID of the photo to delete.
 * @returns {Promise<void>}
 */
const deletePhoto = async (id) => {
  // 1. Fetch the record first to get the storage_path
  const { data: photo, error: fetchError } = await supabase
    .from('photos')
    .select('id, storage_path')
    .eq('id', id)
    .single();

  if (fetchError || !photo) {
    throw Object.assign(
      new Error('Photo not found.'),
      { status: 404 }
    );
  }

  // 2. Delete the database record
  const { error: deleteError } = await supabase
    .from('photos')
    .delete()
    .eq('id', id);

  if (deleteError) {
    throw Object.assign(
      new Error(`Failed to delete photo record: ${deleteError.message}`),
      { status: 502 }
    );
  }

  // 3. Remove the file from storage (non-fatal if it fails)
  await deleteFromStorage(photo.storage_path);
};

module.exports = { getAllPhotos, uploadPhoto, deletePhoto };

/**
 * storage.js  (utils)
 * Low-level helpers for interacting with Supabase Storage.
 * Keeps all storage concerns out of the service layer.
 */

const path = require('path');
const { v4: uuidv4 } = require('uuid');
const supabase = require('../config/supabase');

const BUCKET = process.env.SUPABASE_BUCKET || 'portfolio';

/**
 * Builds a unique storage path for an uploaded file.
 * Format: <uuid>-<sanitised-original-name>
 *
 * @param {string} originalName  - Original filename from the client.
 * @returns {string}             - Unique path to store in the bucket.
 */
const buildStoragePath = (originalName) => {
  const ext = path.extname(originalName).toLowerCase();
  const base = path
    .basename(originalName, ext)
    .replace(/[^a-z0-9]/gi, '-') // replace non-alphanumeric with dashes
    .toLowerCase()
    .slice(0, 60); // cap length

  return `${uuidv4()}-${base}${ext}`;
};

/**
 * Uploads a file buffer to Supabase Storage.
 *
 * @param {Buffer} buffer        - File contents.
 * @param {string} mimetype      - MIME type of the file (e.g. 'image/jpeg').
 * @param {string} originalName  - Original filename (used to derive the path).
 * @returns {Promise<{ storagePath: string, publicUrl: string }>}
 */
const uploadToStorage = async (buffer, mimetype, originalName) => {
  const storagePath = buildStoragePath(originalName);

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, buffer, {
      contentType: mimetype,
      upsert: false, // never silently overwrite — UUIDs make collisions impossible
    });

  if (uploadError) {
    throw Object.assign(
      new Error(`Storage upload failed: ${uploadError.message}`),
      { status: 502 }
    );
  }

  // Retrieve the permanent public URL (works only when the bucket is public)
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);

  if (!data?.publicUrl) {
    throw Object.assign(
      new Error('Could not retrieve public URL from Supabase Storage.'),
      { status: 502 }
    );
  }

  return { storagePath, publicUrl: data.publicUrl };
};

/**
 * Removes a file from Supabase Storage.
 *
 * @param {string} storagePath  - The path within the bucket to delete.
 * @returns {Promise<void>}
 */
const deleteFromStorage = async (storagePath) => {
  const { error } = await supabase.storage.from(BUCKET).remove([storagePath]);

  if (error) {
    // Log but do not throw — the DB record deletion is the critical part.
    // The orphaned file can be cleaned up later via a maintenance job.
    console.error(`[storage] Failed to delete "${storagePath}":`, error.message);
  }
};

module.exports = { uploadToStorage, deleteFromStorage };

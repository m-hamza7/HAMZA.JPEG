/**
 * storage.js
 * Supabase Storage helpers — upload and delete files in the `portfolio` bucket.
 */

const { v4: uuidv4 } = require('uuid');
const path           = require('path');
const supabase       = require('../config/supabase');

const BUCKET = process.env.SUPABASE_BUCKET || 'portfolio';

/**
 * Builds a unique storage path from the original filename.
 * Format: <uuid>-<sanitised-basename>.<lowercased-ext>
 *
 * Example: "My Photo (1).JPEG" → "550e8400-...-my-photo--1-.jpeg"
 */
const buildStoragePath = (originalName) => {
  const ext      = path.extname(originalName).toLowerCase();
  const basename = path.basename(originalName, path.extname(originalName))
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-') // non-alphanumeric → hyphen
    .slice(0, 60);               // cap length

  return `${uuidv4()}-${basename}${ext}`;
};

/**
 * Uploads a file buffer to Supabase Storage.
 *
 * @param {Buffer} buffer       - File contents
 * @param {string} mimetype     - MIME type (e.g. "image/jpeg")
 * @param {string} originalName - Original filename from the client
 * @returns {{ storagePath: string, publicUrl: string }}
 */
const uploadToStorage = async (buffer, mimetype, originalName) => {
  const storagePath = buildStoragePath(originalName);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, buffer, {
      contentType: mimetype,
      upsert: false,
    });

  if (error) {
    throw Object.assign(
      new Error(`Storage upload failed: ${error.message}`),
      { status: 502 }
    );
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);

  return { storagePath, publicUrl: data.publicUrl };
};

/**
 * Removes a file from Supabase Storage.
 * Non-fatal — logs the error but does not throw, because the DB record
 * deletion is the critical step (orphaned storage files can be cleaned up later).
 *
 * @param {string} storagePath - Path inside the bucket
 */
const deleteFromStorage = async (storagePath) => {
  const { error } = await supabase.storage.from(BUCKET).remove([storagePath]);

  if (error) {
    console.error(`[storage] Failed to delete "${storagePath}":`, error.message);
  }
};

module.exports = { uploadToStorage, deleteFromStorage };

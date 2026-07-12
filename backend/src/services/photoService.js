/**
 * photoService.js
 * All Supabase database interactions live here.
 */

const supabase = require('../config/supabase');
const { uploadToStorage, deleteFromStorage } = require('../utils/storage');

const TABLE = 'photos';

const PUBLIC_FIELDS =
  'id, public_url, category, is_featured, caption, story, sort_order, featured_sort_order, created_at';

// ─── GET all photos ────────────────────────────────────────────────────────

const getAllPhotos = async () => {
  const { data, error } = await supabase
    .from(TABLE)
    .select(PUBLIC_FIELDS)
    .order('sort_order', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (error) {
    throw Object.assign(
      new Error(`Failed to fetch photos: ${error.message}`),
      { status: 502 }
    );
  }

  return data;
};

// ─── Next sort index ───────────────────────────────────────────────────────

const getNextSortOrder = async () => {
  const { data } = await supabase
    .from(TABLE)
    .select('sort_order')
    .order('sort_order', { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();

  return (data?.sort_order ?? -1) + 1;
};

// ─── Upload a photo ────────────────────────────────────────────────────────

const uploadPhoto = async (
  buffer,
  mimetype,
  originalname,
  category,
  { isFeatured = false, caption = null, story = null } = {}
) => {
  const { storagePath, publicUrl } = await uploadToStorage(buffer, mimetype, originalname);
  const sortOrder = await getNextSortOrder();

  const insert = {
    filename:     originalname,
    storage_path: storagePath,
    public_url:   publicUrl,
    category,
    is_featured:  isFeatured,
    caption,
    story,
    sort_order:   sortOrder,
  };

  if (isFeatured) {
    const { count } = await supabase
      .from(TABLE)
      .select('*', { count: 'exact', head: true })
      .eq('is_featured', true);
    insert.featured_sort_order = count ?? 0;
  }

  const { data, error } = await supabase.from(TABLE).insert(insert).select().single();

  if (error) {
    throw Object.assign(
      new Error(`Failed to save photo record: ${error.message}`),
      { status: 502 }
    );
  }

  return data;
};

// ─── Update a photo ────────────────────────────────────────────────────────

const updatePhoto = async (id, fields) => {
  const allowed = ['category', 'caption', 'story', 'is_featured'];
  const patch = {};

  for (const key of allowed) {
    if (fields[key] !== undefined) patch[key] = fields[key];
  }

  if (Object.keys(patch).length === 0) {
    throw Object.assign(new Error('No valid fields to update.'), { status: 400 });
  }

  // When toggling featured on, assign featured_sort_order if missing
  if (patch.is_featured === true) {
    const { data: existing } = await supabase
      .from(TABLE)
      .select('featured_sort_order')
      .eq('id', id)
      .single();

    if (existing && existing.featured_sort_order == null) {
      const { count } = await supabase
        .from(TABLE)
        .select('*', { count: 'exact', head: true })
        .eq('is_featured', true);
      patch.featured_sort_order = count ?? 0;
    }
  }

  if (patch.is_featured === false) {
    patch.featured_sort_order = null;
  }

  const { data, error } = await supabase
    .from(TABLE)
    .update(patch)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw Object.assign(
      new Error(`Failed to update photo: ${error.message}`),
      { status: 502 }
    );
  }

  if (!data) {
    throw Object.assign(new Error('Photo not found.'), { status: 404 });
  }

  return data;
};

// ─── Reorder photos ────────────────────────────────────────────────────────

/**
 * @param {{ gallery?: string[], featured?: string[] }} orders
 */
const reorderPhotos = async ({ gallery = [], featured = [] }) => {
  const updates = [];

  gallery.forEach((id, index) => {
    updates.push(
      supabase.from(TABLE).update({ sort_order: index }).eq('id', id)
    );
  });

  featured.forEach((id, index) => {
    updates.push(
      supabase
        .from(TABLE)
        .update({ featured_sort_order: index, is_featured: true })
        .eq('id', id)
    );
  });

  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);

  if (failed?.error) {
    throw Object.assign(
      new Error(`Failed to reorder photos: ${failed.error.message}`),
      { status: 502 }
    );
  }

  return getAllPhotos();
};

// ─── Delete a photo ────────────────────────────────────────────────────────

const deletePhoto = async (id) => {
  const { data: photo, error: fetchError } = await supabase
    .from(TABLE)
    .select('storage_path')
    .eq('id', id)
    .single();

  if (fetchError || !photo) {
    throw Object.assign(new Error('Photo not found.'), { status: 404 });
  }

  const { error: deleteError } = await supabase.from(TABLE).delete().eq('id', id);

  if (deleteError) {
    throw Object.assign(
      new Error(`Failed to delete photo record: ${deleteError.message}`),
      { status: 502 }
    );
  }

  await deleteFromStorage(photo.storage_path);
};

module.exports = { getAllPhotos, uploadPhoto, updatePhoto, reorderPhotos, deletePhoto };

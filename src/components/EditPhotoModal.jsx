import { useState } from "react";
import { updatePhoto, deletePhoto } from "../api/photos.js";

export default function EditPhotoModal({ photo, onClose, onSaved, onDeleted }) {
  const [category, setCategory] = useState(photo.category || "");
  const [caption, setCaption] = useState(photo.caption || "");
  const [story, setStory] = useState(photo.story || "");
  const [isFeatured, setIsFeatured] = useState(Boolean(photo.is_featured));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();
    if (!category.trim()) {
      setError("Category is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const updated = await updatePhoto(photo.id, {
        category: category.trim(),
        caption: caption.trim() || null,
        story: story.trim() || null,
        is_featured: isFeatured,
      });
      onSaved(updated);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this photo permanently?")) return;

    setLoading(true);
    setError("");

    try {
      await deletePhoto(photo.id);
      onDeleted(photo.id);
      onClose();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Edit photo">
      <div className="modal-overlay" onClick={onClose} />
      <form className="modal-card modal-card-wide" onSubmit={handleSave}>
        <p className="modal-eyebrow">Edit mode</p>
        <h2 className="modal-title">Edit photo</h2>

        <div className="edit-preview">
          <img src={photo.public_url} alt={photo.category} />
        </div>

        <label className="field">
          <span className="field-label">Category</span>
          <input
            className="field-input"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </label>

        <label className="field field-checkbox">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
          />
          <span>Featured story</span>
        </label>

        <label className="field">
          <span className="field-label">Caption</span>
          <textarea
            className="field-input field-textarea"
            rows={2}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </label>

        <label className="field">
          <span className="field-label">Story</span>
          <textarea
            className="field-input field-textarea"
            rows={4}
            value={story}
            onChange={(e) => setStory(e.target.value)}
          />
        </label>

        {error && <p className="field-error">{error}</p>}

        <div className="modal-actions modal-actions-spread">
          <button
            className="btn btn-danger"
            type="button"
            onClick={handleDelete}
            disabled={loading}
          >
            Delete
          </button>
          <div className="modal-actions">
            <button className="btn btn-ghost" type="button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

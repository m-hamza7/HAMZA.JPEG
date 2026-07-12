import { useState } from "react";
import { uploadPhoto } from "../api/photos.js";

export default function UploadPanel({ onClose, onUploaded }) {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [caption, setCaption] = useState("");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Choose an image to upload.");
      return;
    }
    if (!category.trim()) {
      setError("Category is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const form = new FormData();
      form.append("image", file);
      form.append("category", category.trim());
      if (isFeatured) form.append("is_featured", "true");
      if (caption.trim()) form.append("caption", caption.trim());
      if (story.trim()) form.append("story", story.trim());

      const photo = await uploadPhoto(form);
      onUploaded(photo);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Upload photo">
      <div className="modal-overlay" onClick={onClose} />
      <form className="modal-card modal-card-wide" onSubmit={handleSubmit}>
        <p className="modal-eyebrow">Edit mode</p>
        <h2 className="modal-title">Upload photo</h2>

        <label className="field">
          <span className="field-label">Image</span>
          <input
            className="field-input"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>

        <label className="field">
          <span className="field-label">Category</span>
          <input
            className="field-input"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Street, Portrait…"
          />
        </label>

        <label className="field field-checkbox">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
          />
          <span>Show in Featured section</span>
        </label>

        {isFeatured && (
          <>
            <label className="field">
              <span className="field-label">Caption</span>
              <textarea
                className="field-input field-textarea"
                rows={2}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Short caption under the card"
              />
            </label>
            <label className="field">
              <span className="field-label">Story</span>
              <textarea
                className="field-input field-textarea"
                rows={4}
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="Longer narrative for the lightbox"
              />
            </label>
          </>
        )}

        {error && <p className="field-error">{error}</p>}

        <div className="modal-actions">
          <button className="btn btn-ghost" type="button" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Uploading…" : "Upload"}
          </button>
        </div>
      </form>
    </div>
  );
}

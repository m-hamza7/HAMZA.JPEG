import { useState } from "react";

export default function LinksEditor({ links, onClose, onSave }) {
  const [instagramUrl, setInstagramUrl] = useState(links.instagramUrl);
  const [instagramHandle, setInstagramHandle] = useState(links.instagramHandle);
  const [contactEmail, setContactEmail] = useState(links.contactEmail);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      instagramUrl: instagramUrl.trim(),
      instagramHandle: instagramHandle.trim(),
      contactEmail: contactEmail.trim(),
    });
    onClose();
  };

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Edit links">
      <div className="modal-overlay" onClick={onClose} />
      <form className="modal-card" onSubmit={handleSubmit}>
        <p className="modal-eyebrow">Edit mode</p>
        <h2 className="modal-title">Site links</h2>
        <p className="modal-subtitle">Update navigation and footer links.</p>

        <label className="field">
          <span className="field-label">Instagram URL</span>
          <input
            className="field-input"
            type="url"
            value={instagramUrl}
            onChange={(e) => setInstagramUrl(e.target.value)}
          />
        </label>

        <label className="field">
          <span className="field-label">Instagram handle</span>
          <input
            className="field-input"
            type="text"
            value={instagramHandle}
            onChange={(e) => setInstagramHandle(e.target.value)}
            placeholder="@username"
          />
        </label>

        <label className="field">
          <span className="field-label">Contact email</span>
          <input
            className="field-input"
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
          />
        </label>

        <div className="modal-actions">
          <button className="btn btn-ghost" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" type="submit">
            Save links
          </button>
        </div>
      </form>
    </div>
  );
}

import { useState } from "react";

export default function PasswordModal({ onClose, onSuccess }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    onSuccess(password, setError);
  };

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Enter edit password">
      <div className="modal-overlay" onClick={onClose} />
      <form className="modal-card" onSubmit={handleSubmit}>
        <p className="modal-eyebrow">Restricted</p>
        <h2 className="modal-title">Are you Hmza❓</h2>
        <p className="modal-subtitle">Enter the password to manage photos and links.</p>

        <label className="field">
          <span className="field-label">Password</span>
          <input
            className="field-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            autoComplete="current-password"
          />
        </label>

        {error && <p className="field-error">{error}</p>}

        <div className="modal-actions">
          <button className="btn btn-ghost" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" type="submit">
            Unlock
          </button>
        </div>
      </form>
    </div>
  );
}

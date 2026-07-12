/**
 * Lightbox — full-screen modal for gallery and featured photos.
 *
 * If tile.story is present → two-column layout (image + story panel, no arrows).
 * Otherwise             → full image with prev/next navigation arrows.
 */
export default function Lightbox({ tile, onClose, onPrev, onNext }) {
  if (!tile) return null;

  const hasStory = Boolean(tile.story);

  return (
    <div className="lightbox" role="dialog" aria-modal="true">
      <div className="lightbox-overlay" onClick={onClose} />

      <div className={`lightbox-panel ${hasStory ? "lightbox-panel-wide" : ""}`}>

        {/* Close button */}
        <button className="icon-button" type="button" onClick={onClose}>
          Close
        </button>

        {/* Body */}
        <div className={`lightbox-body ${hasStory ? "with-story" : ""}`}>

          {/* Image / frame */}
          <div className="lightbox-frame" style={{ background: tile.tone || "#141821" }}>
            {tile.src ? (
              <img
                src={tile.src}
                alt={tile.title}
                className="lightbox-image"
              />
            ) : (
              <span className="lightbox-title">{tile.title}</span>
            )}
          </div>

          {/* Story panel (Featured only) */}
          {hasStory && (
            <div className="lightbox-story">
              <span className="lightbox-story-label">{tile.title}</span>
              <p className="lightbox-story-text">{tile.story}</p>
            </div>
          )}
        </div>

        {/* Category label for gallery photos */}
        {!hasStory && tile.title && (
          <p className="lightbox-meta">{tile.title}</p>
        )}

        {/* Prev / Next arrows (gallery only, no story) */}
        {!hasStory && (
          <div className="lightbox-controls">
            <button className="arrow" type="button" onClick={onPrev} aria-label="Previous photo">
              ←
            </button>
            <span className="lightbox-hint">Navigate through the collection</span>
            <button className="arrow" type="button" onClick={onNext} aria-label="Next photo">
              →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

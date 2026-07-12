export default function Lightbox({ tile, onClose, onPrev, onNext }) {
  if (!tile) {
    return null;
  }

  const hasStory = Boolean(tile.story);

  return (
    <div className="lightbox" role="dialog" aria-modal="true">
      <div className="lightbox-overlay" onClick={onClose} />
      <div className={`lightbox-panel ${hasStory ? "lightbox-panel-wide" : ""}`}>
        <button className="icon-button" type="button" onClick={onClose}>
          Close
        </button>
        <div className={`lightbox-body ${hasStory ? "with-story" : ""}`}>
          <div className="lightbox-frame" style={{ background: tile.tone }}>
            <span className="lightbox-title">{tile.title}</span>
          </div>
          {hasStory ? (
            <div className="lightbox-story">
              <span className="lightbox-story-label">Story</span>
              <p className="lightbox-story-text">{tile.story}</p>
            </div>
          ) : null}
        </div>
        {hasStory ? null : (
          <div className="lightbox-controls">
            <button className="arrow" type="button" onClick={onPrev}>
              ←
            </button>
            <span className="lightbox-hint">Swipe through the collection</span>
            <button className="arrow" type="button" onClick={onNext}>
                →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

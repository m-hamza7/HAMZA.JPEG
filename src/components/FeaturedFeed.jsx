import { useState } from "react";

function reorderList(list, fromId, toId) {
  if (fromId === toId) return list;
  const next = [...list];
  const fromIndex = next.findIndex((p) => p.id === fromId);
  const toIndex = next.findIndex((p) => p.id === toId);
  if (fromIndex < 0 || toIndex < 0) return list;
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
}

export default function FeaturedFeed({
  items,
  editMode,
  onOpen,
  onEdit,
  onReorder,
}) {
  const [dragId, setDragId] = useState(null);
  const [localItems, setLocalItems] = useState(null);

  const displayItems = localItems ?? items;

  const handleDragStart = (id) => {
    if (!editMode) return;
    setDragId(id);
  };

  const handleDragOver = (e, targetId) => {
    if (!editMode || !dragId || dragId === targetId) return;
    e.preventDefault();
    setLocalItems((prev) => reorderList(prev ?? items, dragId, targetId));
  };

  const handleDragEnd = async () => {
    if (!editMode || !dragId) return;
    const order = (localItems ?? items).map((p) => p.id);
    setDragId(null);
    setLocalItems(null);
    await onReorder(order);
  };

  if (displayItems.length === 0) {
    return (
      <p className="gallery-status">
        {editMode
          ? "No featured photos yet. Upload one or mark a photo as featured."
          : "No featured photos yet."}
      </p>
    );
  }

  return (
    <div className="featured-feed">
      {displayItems.map((post, index) => (
        <article
          className={`featured-card ${editMode ? "featured-card--edit" : ""}`}
          key={post.id}
          draggable={editMode}
          onDragStart={() => handleDragStart(post.id)}
          onDragOver={(e) => handleDragOver(e, post.id)}
          onDragEnd={handleDragEnd}
        >
          <div className="featured-media-wrap">
            <button
              className="featured-media"
              type="button"
              style={{ background: post.tone }}
              onClick={() => !editMode && onOpen(index)}
            >
              <img
                src={post.src}
                alt={post.title}
                className="featured-image"
                loading="lazy"
                draggable={false}
              />
              <span className="featured-title">{post.title}</span>
            </button>

            {editMode && (
              <div className="edit-actions">
                <button
                  className="edit-chip"
                  type="button"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={() => onEdit(post.raw)}
                >
                  Edit
                </button>
                {dragId && <span className="edit-chip edit-chip--hint">Drag to reorder</span>}
              </div>
            )}
          </div>

          {post.caption && <p className="featured-caption">{post.caption}</p>}
        </article>
      ))}
    </div>
  );
}

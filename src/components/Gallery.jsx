import { useState } from "react";

function reorderList(list, fromId, toId) {
  if (fromId === toId) return list;
  const next = [...list];
  const fromIndex = next.findIndex((t) => t.id === fromId);
  const toIndex = next.findIndex((t) => t.id === toId);
  if (fromIndex < 0 || toIndex < 0) return list;
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
}

/**
 * Gallery — phone-style fixed grid.
 * In edit mode: drag-reorder real tiles, edit/delete controls.
 */
export default function Gallery({
  grid,
  tiles,
  editMode,
  onOpen,
  onEdit,
  onReorder,
}) {
  const [dragId, setDragId] = useState(null);
  const [localTiles, setLocalTiles] = useState(null);

  const activeTiles = localTiles ?? tiles;

  const buildGrid = () => {
    const blanks = Math.max(0, grid.length - activeTiles.length);
    return [...activeTiles, ...Array(blanks).fill(null)];
  };

  const displayGrid = localTiles ? buildGrid() : grid;

  const handleDragStart = (id) => {
    if (!editMode) return;
    setDragId(id);
  };

  const handleDragOver = (e, targetId) => {
    if (!editMode || !dragId || !targetId || dragId === targetId) return;
    e.preventDefault();
    setLocalTiles((prev) => reorderList(prev ?? tiles, dragId, targetId));
  };

  const handleDragEnd = async () => {
    if (!editMode || !dragId) return;
    const order = (localTiles ?? tiles).map((t) => t.id);
    setDragId(null);
    setLocalTiles(null);
    await onReorder(order);
  };

  let realIndex = -1;

  return (
    <section className="gallery" aria-label="Photo gallery">
      {displayGrid.map((tile, i) => {
        if (tile) {
          realIndex++;
          const capturedIndex = realIndex;

          return (
            <div
              key={tile.id}
              className={`tile-wrap ${editMode ? "tile-wrap--edit" : ""}`}
              draggable={editMode}
              onDragStart={() => handleDragStart(tile.id)}
              onDragOver={(e) => handleDragOver(e, tile.id)}
              onDragEnd={handleDragEnd}
            >
              <button
                type="button"
                className="tile"
                onClick={() => !editMode && onOpen(capturedIndex)}
                aria-label={`Open photo: ${tile.title}`}
              >
                <img
                  src={tile.src}
                  alt={tile.title}
                  className="tile-image"
                  loading="lazy"
                  draggable={false}
                />
                <span className="tile-category">{tile.title}</span>
              </button>

              {editMode && (
                <div className="edit-actions edit-actions--tile">
                  <button
                    className="edit-chip"
                    type="button"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={() => onEdit(tile.raw)}
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          );
        }

        return (
          <div key={`empty-${i}`} className="tile tile--empty" aria-hidden="true" />
        );
      })}
    </section>
  );
}

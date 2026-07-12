export default function Gallery({ tiles, onOpen }) {
  return (
    <section className="gallery" aria-label="Photo gallery">
      {tiles.map((tile, index) => (
        <button
          key={tile.id}
          type="button"
          className="tile"
          style={{ background: tile.tone }}
          onClick={() => onOpen(index)}
        >
          <span className="tile-label">{tile.title}</span>
        </button>
      ))}
    </section>
  );
}

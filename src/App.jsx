import { useMemo, useState } from "react";
import Gallery from "./components/Gallery.jsx";
import Lightbox from "./components/Lightbox.jsx";

const buildTiles = () => {
  const palette = [
    "#0f1115",
    "#141821",
    "#1a212b",
    "#202a35",
    "#171b24",
    "#1e2430",
    "#13161d",
    "#242d39",
    "#1b2029",
    "#191f28",
    "#12161c",
    "#222a34"
  ];

  return Array.from({ length: 18 }, (_, index) => ({
    id: index + 1,
    title: `Frame ${String(index + 1).padStart(2, "0")}`,
    tone: palette[index % palette.length]
  }));
};

const buildFeatured = () => {
  const tones = ["#0f1218", "#151b24", "#1c2430", "#202a35", "#18202a", "#222c38"];

  return Array.from({ length: 6 }, (_, index) => ({
    id: `featured-${index + 1}`,
    title: `Featured ${String(index + 1).padStart(2, "0")}`,
    caption:
      "A quiet moment, captured on the move. Swap this caption with your own story.",
    story:
      "This frame was captured just before sunset, where the light shifted from warm to deep blue within minutes. Replace this with the real story behind your image.",
    tone: tones[index % tones.length]
  }));
};

export default function App() {
  const tiles = useMemo(() => buildTiles(), []);
  const featured = useMemo(() => buildFeatured(), []);
  const [section, setSection] = useState("featured");
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(null);
  const [activeFeaturedIndex, setActiveFeaturedIndex] = useState(null);

  const handleClose = () => {
    setActiveGalleryIndex(null);
    setActiveFeaturedIndex(null);
  };

  const handleGalleryOpen = (index) => setActiveGalleryIndex(index);
  const handleGalleryPrev = () =>
    setActiveGalleryIndex((current) =>
      current === 0 ? tiles.length - 1 : current - 1
    );
  const handleGalleryNext = () =>
    setActiveGalleryIndex((current) =>
      current === tiles.length - 1 ? 0 : current + 1
    );

  const handleFeaturedOpen = (index) => setActiveFeaturedIndex(index);
  const handleFeaturedPrev = () =>
    setActiveFeaturedIndex((current) =>
      current === 0 ? featured.length - 1 : current - 1
    );
  const handleFeaturedNext = () =>
    setActiveFeaturedIndex((current) =>
      current === featured.length - 1 ? 0 : current + 1
    );

  return (
    <div className="app">
      <nav className="navbar">
        <div className="brand">Hmza</div>
        <div className="nav-actions">
          <button
            className={`nav-button ${section === "featured" ? "active" : ""}`}
            type="button"
            onClick={() => setSection("featured")}
          >
            Featured
          </button>
          <button
            className={`nav-button ${section === "gallery" ? "active" : ""}`}
            type="button"
            onClick={() => setSection("gallery")}
          >
            Gallery
          </button>
          <a
            className="nav-link"
            href="https://www.instagram.com/m.hamza.jpeg"
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
        </div>
      </nav>

      {section === "featured" ? (
        <section className="featured">
          <header className="section-header">
            <p className="eyebrow">Featured Stories</p>
            <h1>Instagram-style frames with narrative focus.</h1>
            <p className="subtitle">
              Each photo pairs with a caption and a deeper story in the lightbox.
            </p>
          </header>
          <div className="featured-feed">
            {featured.map((post, index) => (
              <article className="featured-card" key={post.id}>
                <button
                  className="featured-media"
                  type="button"
                  style={{ background: post.tone }}
                  onClick={() => handleFeaturedOpen(index)}
                >
                  <span className="featured-title">{post.title}</span>
                </button>
                <p className="featured-caption">{post.caption}</p>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <>
          <header className="hero">
            <p className="eyebrow">Mobile Photography Archive</p>
            <h1>Minimal gallery for bold, focused imagery.</h1>
            <p className="subtitle">
              Replace these tiles with your favorite mobile captures. Tap any frame
              to enlarge and navigate through the collection.
            </p>
          </header>

          <Gallery tiles={tiles} onOpen={handleGalleryOpen} />
        </>
      )}

      <Lightbox
        tile={activeGalleryIndex !== null ? tiles[activeGalleryIndex] : null}
        onClose={handleClose}
        onPrev={handleGalleryPrev}
        onNext={handleGalleryNext}
      />

      <Lightbox
        tile={activeFeaturedIndex !== null ? featured[activeFeaturedIndex] : null}
        onClose={handleClose}
        onPrev={handleFeaturedPrev}
        onNext={handleFeaturedNext}
      />

      <footer className="footer">
        <span>Contact: muhmd.hamza0@gmail.com</span>
        <span className="footer-divider">/</span>
        <a href="https://www.instagram.com/m.hamza.jpeg" target="_blank" rel="noreferrer">
          @m.hamza.jpeg
        </a>
      </footer>
    </div>
  );
}

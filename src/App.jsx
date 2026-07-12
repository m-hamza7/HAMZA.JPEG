import { useCallback, useEffect, useMemo, useState } from "react";
import Gallery from "./components/Gallery.jsx";
import Lightbox from "./components/Lightbox.jsx";
import FeaturedFeed from "./components/FeaturedFeed.jsx";
import PasswordModal from "./components/PasswordModal.jsx";
import UploadPanel from "./components/UploadPanel.jsx";
import EditPhotoModal from "./components/EditPhotoModal.jsx";
import LinksEditor from "./components/LinksEditor.jsx";
import { fetchPhotos, reorderPhotos } from "./api/photos.js";
import {
  GRID_SIZE,
  POLL_MS,
  EDIT_PASSWORD,
  DEFAULT_LINKS,
  LINKS_STORAGE_KEY,
  EDIT_SESSION_KEY,
} from "./constants.js";

function loadLinks() {
  try {
    const stored = localStorage.getItem(LINKS_STORAGE_KEY);
    return stored ? { ...DEFAULT_LINKS, ...JSON.parse(stored) } : { ...DEFAULT_LINKS };
  } catch {
    return { ...DEFAULT_LINKS };
  }
}

function sortGallery(photos) {
  return [...photos].sort((a, b) => {
    const ao = a.sort_order ?? Number.MAX_SAFE_INTEGER;
    const bo = b.sort_order ?? Number.MAX_SAFE_INTEGER;
    if (ao !== bo) return ao - bo;
    return new Date(b.created_at) - new Date(a.created_at);
  });
}

function sortFeatured(photos) {
  return photos
    .filter((p) => p.is_featured)
    .sort((a, b) => {
      const ao = a.featured_sort_order ?? Number.MAX_SAFE_INTEGER;
      const bo = b.featured_sort_order ?? Number.MAX_SAFE_INTEGER;
      if (ao !== bo) return ao - bo;
      return new Date(b.created_at) - new Date(a.created_at);
    });
}

export default function App() {
  const [section, setSection] = useState("featured");
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(null);
  const [activeFeaturedIndex, setActiveFeaturedIndex] = useState(null);

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [isEditMode, setIsEditMode] = useState(
    () => sessionStorage.getItem(EDIT_SESSION_KEY) === "true"
  );
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showUploadPanel, setShowUploadPanel] = useState(false);
  const [showLinksEditor, setShowLinksEditor] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [siteLinks, setSiteLinks] = useState(loadLinks);

  const refreshPhotos = useCallback(async () => {
    try {
      const data = await fetchPhotos();
      setPhotos(data);
      setFetchError(null);
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshPhotos();
    if (isEditMode) return undefined;

    const interval = setInterval(refreshPhotos, POLL_MS);
    return () => clearInterval(interval);
  }, [refreshPhotos, isEditMode]);

  const galleryPhotos = useMemo(() => sortGallery(photos), [photos]);
  const featuredPhotos = useMemo(() => sortFeatured(photos), [photos]);

  const featured = useMemo(
    () =>
      featuredPhotos.map((p) => ({
        id: p.id,
        title: p.category,
        caption: p.caption,
        story: p.story,
        src: p.public_url,
        tone: "#141821",
        raw: p,
      })),
    [featuredPhotos]
  );

  const tiles = useMemo(
    () =>
      galleryPhotos.map((p) => ({
        id: p.id,
        title: p.category,
        src: p.public_url,
        tone: "#141821",
        raw: p,
      })),
    [galleryPhotos]
  );

  const grid = useMemo(() => {
    const blanks = Math.max(0, GRID_SIZE - tiles.length);
    return [...tiles, ...Array(blanks).fill(null)];
  }, [tiles]);

  const handlePasswordSubmit = (password, setError) => {
    if (password === EDIT_PASSWORD) {
      setIsEditMode(true);
      sessionStorage.setItem(EDIT_SESSION_KEY, "true");
      setShowPasswordModal(false);
      return;
    }
    setError("Incorrect password.");
  };

  const exitEditMode = () => {
    setIsEditMode(false);
    sessionStorage.removeItem(EDIT_SESSION_KEY);
    setShowUploadPanel(false);
    setShowLinksEditor(false);
    setEditingPhoto(null);
    refreshPhotos();
  };

  const handleGalleryReorder = async (ids) => {
    const data = await reorderPhotos({ gallery: ids });
    setPhotos(data);
  };

  const handleFeaturedReorder = async (ids) => {
    const data = await reorderPhotos({ featured: ids });
    setPhotos(data);
  };

  const handlePhotoSaved = (updated) => {
    setPhotos((prev) => prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p)));
    refreshPhotos();
  };

  const handlePhotoDeleted = (id) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    refreshPhotos();
  };

  const handleLinksSave = (links) => {
    setSiteLinks(links);
    localStorage.setItem(LINKS_STORAGE_KEY, JSON.stringify(links));
  };

  const handleClose = () => {
    setActiveGalleryIndex(null);
    setActiveFeaturedIndex(null);
  };

  const handleGalleryOpen = (realIndex) => setActiveGalleryIndex(realIndex);
  const handleGalleryPrev = () =>
    setActiveGalleryIndex((i) => (i === 0 ? tiles.length - 1 : i - 1));
  const handleGalleryNext = () =>
    setActiveGalleryIndex((i) => (i === tiles.length - 1 ? 0 : i + 1));

  const handleFeaturedOpen = (index) => setActiveFeaturedIndex(index);
  const handleFeaturedPrev = () =>
    setActiveFeaturedIndex((i) => (i === 0 ? featured.length - 1 : i - 1));
  const handleFeaturedNext = () =>
    setActiveFeaturedIndex((i) => (i === featured.length - 1 ? 0 : i + 1));

  return (
    <div className={`app ${isEditMode ? "app--edit" : ""}`}>
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
            href={siteLinks.instagramUrl}
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>

          <button
            className={`nav-button nav-button--edit ${isEditMode ? "active" : ""}`}
            type="button"
            onClick={() => (isEditMode ? exitEditMode() : setShowPasswordModal(true))}
          >
            {isEditMode ? "Viewer mode" : "Edit mode"}
          </button>
        </div>
      </nav>

      {isEditMode && (
        <div className="edit-toolbar">
          <span className="edit-toolbar-label">Editing</span>
          <button className="btn btn-ghost btn-sm" type="button" onClick={() => setShowUploadPanel(true)}>
            Upload photo
          </button>
          <button className="btn btn-ghost btn-sm" type="button" onClick={() => setShowLinksEditor(true)}>
            Edit links
          </button>
          <span className="edit-toolbar-hint">Drag items to reorder · click Edit on any photo</span>
        </div>
      )}

      {section === "featured" && (
        <section className="featured">
          <header className="section-header">
            <p className="eyebrow">Featured Stories</p>
            <h1>Frames that carry a narrative.</h1>
            <p className="subtitle">
              Each photo pairs with a story in the lightbox. Tap any card to read it.
            </p>
          </header>

          {loading && <p className="gallery-status">Loading…</p>}

          {!loading && (
            <FeaturedFeed
              items={featured}
              editMode={isEditMode}
              onOpen={handleFeaturedOpen}
              onEdit={setEditingPhoto}
              onReorder={handleFeaturedReorder}
            />
          )}
        </section>
      )}

      {section === "gallery" && (
        <>
          <header className="hero">
            <p className="eyebrow">Mobile Photography Archive</p>
            <h1>{tiles.length} frame{tiles.length !== 1 ? "s" : ""} captured.</h1>
            <p className="subtitle">
              {loading
                ? "Loading…"
                : fetchError
                ? "Could not reach the server."
                : isEditMode
                ? "Drag tiles to reorder. Click Edit to update or delete."
                : `${GRID_SIZE - tiles.length} slot${GRID_SIZE - tiles.length !== 1 ? "s" : ""} remaining.`}
            </p>
          </header>

          <Gallery
            grid={grid}
            tiles={tiles}
            editMode={isEditMode}
            onOpen={handleGalleryOpen}
            onEdit={setEditingPhoto}
            onReorder={handleGalleryReorder}
          />
        </>
      )}

      {!isEditMode && (
        <>
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
        </>
      )}

      <footer className="footer">
        <span>Contact: {siteLinks.contactEmail}</span>
        <span className="footer-divider">/</span>
        <a href={siteLinks.instagramUrl} target="_blank" rel="noreferrer">
          {siteLinks.instagramHandle}
        </a>
      </footer>

      {showPasswordModal && (
        <PasswordModal
          onClose={() => setShowPasswordModal(false)}
          onSuccess={handlePasswordSubmit}
        />
      )}

      {isEditMode && showUploadPanel && (
        <UploadPanel onClose={() => setShowUploadPanel(false)} onUploaded={refreshPhotos} />
      )}

      {isEditMode && showLinksEditor && (
        <LinksEditor
          links={siteLinks}
          onClose={() => setShowLinksEditor(false)}
          onSave={handleLinksSave}
        />
      )}

      {isEditMode && editingPhoto && (
        <EditPhotoModal
          photo={editingPhoto}
          onClose={() => setEditingPhoto(null)}
          onSaved={handlePhotoSaved}
          onDeleted={handlePhotoDeleted}
        />
      )}
    </div>
  );
}

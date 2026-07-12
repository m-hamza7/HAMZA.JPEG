# Frontend — Components

The frontend is a React + Vite app with a minimal component tree.

---

## Component Tree

```
App.jsx
├── <nav>          ← Navbar (Featured / Gallery / Instagram link)
├── <section>      ← Featured feed  (when section === "featured")
│   └── featured.map → <article.featured-card>
│         ├── <button.featured-media>   ← opens Lightbox
│         └── <p.featured-caption>
├── <>             ← Gallery view (when section === "gallery")
│   ├── <header.hero>
│   └── <Gallery tiles onOpen />
│         └── tiles.map → <button.tile>  ← opens Lightbox
├── <Lightbox />   ← Gallery lightbox (activeGalleryIndex)
├── <Lightbox />   ← Featured lightbox (activeFeaturedIndex)
└── <footer>
```

---

## `App.jsx`

**Responsibility:** Root component. Owns all state, data, and event handlers.

### State

| State | Type | Initial | Description |
|-------|------|---------|-------------|
| `section` | `"featured" \| "gallery"` | `"featured"` | Which view is active |
| `activeGalleryIndex` | `number \| null` | `null` | Index of open gallery tile |
| `activeFeaturedIndex` | `number \| null` | `null` | Index of open featured card |

### Data

- `tiles` — 18 dark placeholder tile objects (`useMemo`)
- `featured` — 6 featured card objects with title, caption, story (`useMemo`)

Both are currently placeholder data. **Phase 2:** replace with `GET /photos` API call.

### Event Handlers

| Handler | Triggered by | Action |
|---------|-------------|--------|
| `handleGalleryOpen(index)` | Tile click | Set `activeGalleryIndex` |
| `handleGalleryPrev/Next()` | Lightbox arrows | Decrement/increment index (wraps) |
| `handleFeaturedOpen(index)` | Featured card click | Set `activeFeaturedIndex` |
| `handleFeaturedPrev/Next()` | — | Decrement/increment index (wraps) |
| `handleClose()` | Lightbox close/overlay | Reset both indexes to `null` |

---

## `Gallery.jsx`

**Responsibility:** Renders the tile grid. Completely presentational — no state.

```jsx
export default function Gallery({ tiles, onOpen }) {
  return (
    <section className="gallery" aria-label="Photo gallery">
      {tiles.map((tile, index) => (
        <button key={tile.id} className="tile"
          style={{ background: tile.tone }}
          onClick={() => onOpen(index)}>
          <span className="tile-label">{tile.title}</span>
        </button>
      ))}
    </section>
  );
}
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `tiles` | Array | Array of tile objects `{ id, title, tone }` |
| `onOpen` | Function | Called with tile index when clicked |

---

## `Lightbox.jsx`

**Responsibility:** Full-screen modal overlay. Renders `null` when `tile` is `null`.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `tile` | Object \| null | The tile/featured data to display |
| `onClose` | Function | Called on close button or overlay click |
| `onPrev` | Function | Navigate to previous item |
| `onNext` | Function | Navigate to next item |

**Behaviour:**

- If `tile.story` exists → renders a two-column layout (image + story panel)
- If no story → renders navigation arrows (prev/next)
- Overlay click calls `onClose`

---

## Styling

All styles live in `src/styles.css`. No CSS-in-JS, no Tailwind.

Key design tokens (CSS variables):

| Variable | Value | Usage |
|----------|-------|-------|
| `--bg` | `#0b0d11` | Page background |
| `--panel` | `#11151b` | Card/lightbox background |
| `--ink` | `#f0f3f7` | Primary text |
| `--muted` | `#98a2b3` | Secondary text, labels |
| `--accent` | `#5aa0ff` | Hover states, active nav |

Font: `Manrope` / `Space Grotesk` (Google Fonts fallback)

---

## Related

- [[Frontend/Gallery]] — gallery-specific visual behaviour
- [[08 Future Roadmap]] — wiring frontend to the real API

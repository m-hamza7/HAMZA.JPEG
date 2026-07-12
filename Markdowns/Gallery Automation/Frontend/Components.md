# Frontend — Components

The frontend is a React + Vite app connected to the Express API.

---

## Component Tree

```
App.jsx
├── <nav>          ← Navbar (Featured / Gallery / Instagram link)
├── <section>      ← Featured feed  (when section === "featured")
│   └── featured.map → <article.featured-card>
│         ├── <button.featured-media>   ← real image, opens Lightbox
│         └── <p.featured-caption>      ← from API caption field
├── <>             ← Gallery view (when section === "gallery")
│   ├── <header.hero>
│   └── <Gallery grid onOpen />
│         ├── <button.tile>   ← real photo (clickable)
│         └── <div.tile--empty>  ← blank placeholder slot
├── <Lightbox />   ← Gallery lightbox (activeGalleryIndex)
├── <Lightbox />   ← Featured lightbox (activeFeaturedIndex, story panel)
└── <footer>
```

---

## `App.jsx`

**Responsibility:** Root component. Owns all state, API fetching, and event handlers.

### Constants

| Constant | Value | Purpose |
|----------|-------|---------|
| `API_URL` | `import.meta.env.VITE_API_URL` or `http://localhost:5000` | Backend base URL |
| `GRID_SIZE` | `30` | Fixed gallery slot count |
| `POLL_MS` | `15000` | Re-fetch interval (ms) |

### State

| State | Type | Initial | Description |
|-------|------|---------|-------------|
| `section` | `"featured" \| "gallery"` | `"featured"` | Which view is active |
| `activeGalleryIndex` | `number \| null` | `null` | Index of open gallery tile |
| `activeFeaturedIndex` | `number \| null` | `null` | Index of open featured card |
| `photos` | `Array` | `[]` | Raw API response |
| `loading` | `boolean` | `true` | Initial fetch in progress |
| `fetchError` | `string \| null` | `null` | Last fetch error message |

### Derived Data (`useMemo`)

| Variable | Source | Shape |
|----------|--------|-------|
| `featured` | `photos.filter(p => p.is_featured)` | `{ id, title, caption, story, src, tone }` |
| `tiles` | All `photos` | `{ id, title, src, tone }` |
| `grid` | `tiles` + `null` blanks up to `GRID_SIZE` | Mixed array for Gallery component |

### Event Handlers

| Handler | Triggered by | Action |
|---------|-------------|--------|
| `handleGalleryOpen(index)` | Tile click | Set `activeGalleryIndex` (real-photo index only) |
| `handleGalleryPrev/Next()` | Lightbox arrows | Decrement/increment index (wraps) |
| `handleFeaturedOpen(index)` | Featured card click | Set `activeFeaturedIndex` |
| `handleFeaturedPrev/Next()` | — | Decrement/increment index (wraps) |
| `handleClose()` | Lightbox close/overlay | Reset both indexes to `null` |

---

## `Gallery.jsx`

**Responsibility:** Renders the phone-style fixed grid. Completely presentational — no state.

```jsx
export default function Gallery({ grid, onOpen }) {
  // grid: Array of tile objects OR null (empty slot)
  // onOpen(realIndex) — called only for real photos
}
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `grid` | Array | Up to 30 elements: tile object or `null` (empty slot) |
| `onOpen` | Function | Called with real-photo index when a tile is clicked |

**Behaviour:**
- Real photos render `<img>` with category label on hover
- Empty slots render `<div class="tile tile--empty">` — not clickable

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

- If `tile.story` exists → two-column layout (image + story panel), no arrows
- If no story → full image with category label + prev/next arrows
- Overlay click calls `onClose`

---

## Environment

Root `.env`:
```
VITE_API_URL=http://localhost:5000
```

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
- [[05 API]] — `GET /photos` response format

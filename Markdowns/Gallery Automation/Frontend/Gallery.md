# Frontend — Gallery

## Current State

The gallery currently renders **placeholder tiles** — dark-toned colour swatches generated from a local array. No real images are loaded yet.

```js
const buildTiles = () => {
  const palette = ["#0f1115", "#141821", "#1a212b", ...]; // 12 dark tones
  return Array.from({ length: 18 }, (_, i) => ({
    id: i + 1,
    title: `Frame ${String(i + 1).padStart(2, "0")}`,
    tone: palette[i % palette.length],
  }));
};
```

18 tiles are rendered in a responsive CSS grid with hover lift animation.

---

## Two Sections

### Featured

Instagram-style vertical cards. Each card has:
- A large media area (min-height 420px on desktop)
- A caption below
- Clicking opens a wide lightbox with a **story panel** on the right

### Gallery

Tile grid archive. Each tile:
- Is min-height 220px
- Shows the frame label in the bottom-left
- Clicking opens a standard lightbox with prev/next navigation

---

## Visual Behaviour

### Tile hover effect

```css
.tile:hover {
  transform: translateY(-6px) scale(1.01);
  border-color: rgba(90, 160, 255, 0.45);
}
```

### Featured media gradient overlay

```css
.featured-media::after {
  content: "";
  background: linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.45));
}
```

### Lightbox backdrop blur

```css
.lightbox-overlay {
  background: rgba(6, 8, 12, 0.7);
  backdrop-filter: blur(8px);
}
```

---

## Responsive Breakpoints

| Breakpoint | Changes |
|-----------|---------|
| ≤ 720px | Navbar stacks vertically, featured cards shrink to 320px, lightbox story stacks to single column |

---

## Wiring to Real API (Phase 2 Task)

Replace the placeholder data in `App.jsx` with a `useEffect` fetch:

```js
// Replace buildTiles() and buildFeatured() with:
const [photos, setPhotos] = useState([]);

useEffect(() => {
  fetch('http://localhost:5000/photos')
    .then(r => r.json())
    .then(data => setPhotos(data));
}, []);
```

Then map `photos` to the tile format:
```js
const tiles = photos.map(p => ({
  id: p.id,
  title: p.category,
  src: p.public_url,   // use <img> instead of background tone
}));
```

Update `Gallery.jsx` to render `<img src={tile.src} />` inside each tile.

---

## Related

- [[Frontend/Components]] — component architecture
- [[05 API]] — `GET /photos` response format
- [[08 Future Roadmap]] — Phase 2 frontend ↔ backend wiring

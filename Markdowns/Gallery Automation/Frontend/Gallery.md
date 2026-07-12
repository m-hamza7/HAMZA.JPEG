# Frontend — Gallery

## Current State

The gallery is **fully dynamic** — it fetches real photos from `GET /photos` and renders them in a phone-style grid.

- **Gallery section** — all uploaded photos in a fixed 30-slot grid
- **Featured section** — photos where `is_featured = true`, with caption and story
- **Live updates** — polls the API every 15 seconds; new uploads appear automatically

---

## Phone-Style Grid

The gallery uses a **fixed 30-slot grid** (3 columns). Uploaded photos fill slots from the top-left; remaining slots are dark empty cells.

```js
const GRID_SIZE = 30;

const grid = useMemo(() => {
  const blanks = Math.max(0, GRID_SIZE - tiles.length);
  return [...tiles, ...Array(blanks).fill(null)];
}, [tiles]);
```

| Element | Class | Behaviour |
|---------|-------|-----------|
| Real photo | `.tile` | Clickable, shows `<img>`, category on hover |
| Empty slot | `.tile.tile--empty` | Dark cell, not interactive |

---

## Two Sections

### Featured

Instagram-style vertical cards driven by the API. Each card has:
- A large media area with the real uploaded image
- A caption below (from `caption` field)
- Clicking opens a wide lightbox with a **story panel** on the right (from `story` field)

Photos appear here only when uploaded with `is_featured=true`.

### Gallery

Phone-style tile grid archive. Each real tile:
- Is square (`aspect-ratio: 1/1`)
- Shows the photo with `object-fit: cover`
- Shows category label on hover
- Clicking opens a standard lightbox with prev/next navigation

Empty slots remain as dark placeholder cells until filled by future uploads.

---

## Visual Behaviour

### Tile hover

```css
.tile:hover {
  opacity: 0.85;
}
.tile:hover .tile-category {
  opacity: 1;
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
| ≤ 720px | Navbar stacks vertically, gallery stays 3-column, featured cards shrink to 320px, lightbox story stacks to single column |

---

## API Integration

```js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

useEffect(() => {
  const fetchPhotos = () => {
    fetch(`${API_URL}/photos`)
      .then(res => res.json())
      .then(data => setPhotos(data));
  };
  fetchPhotos();
  const interval = setInterval(fetchPhotos, 15000);
  return () => clearInterval(interval);
}, []);
```

Mapping:
```js
// Gallery — all photos
const tiles = photos.map(p => ({
  id: p.id, title: p.category, src: p.public_url, tone: "#141821"
}));

// Featured — is_featured only
const featured = photos
  .filter(p => p.is_featured)
  .map(p => ({
    id: p.id, title: p.category, caption: p.caption,
    story: p.story, src: p.public_url, tone: "#141821"
  }));
```

---

## Related

- [[Frontend/Components]] — component architecture
- [[05 API]] — `GET /photos` response format
- [[04 Database]] — `is_featured`, `caption`, `story` columns

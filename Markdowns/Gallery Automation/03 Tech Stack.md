# 03 — Tech Stack

## Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI component library |
| Vite | 5.4.2 | Dev server & build tool |
| Vanilla CSS | — | Styling (no framework) |
| Manrope / Space Grotesk | Google Fonts | Typography |

### Key Frontend Choices
- **No CSS framework** — full control over the dark, editorial aesthetic
- **Vite** over CRA — much faster HMR and build times
- **`useMemo`** for tile/featured data — prevents re-computation on re-render

---

## Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | ≥ 18 | Runtime |
| Express | 4.19.2 | HTTP framework |
| Multer | 2.x | Multipart file parsing |
| `@supabase/supabase-js` | 2.45.4 | Supabase client |
| `uuid` | 11.x | UUID generation for storage paths |
| `dotenv` | 16.4.5 | Environment variable loading |
| `cors` | 2.8.5 | Cross-Origin Resource Sharing |
| `nodemon` | 3.1.4 | Dev auto-restart |

### Key Backend Choices
- **Multer memory storage** — no temp files, buffer streamed directly to Supabase
- **Service-role key** — bypasses Supabase RLS for trusted server-side operations
- **`uuid` v11** — CommonJS compatible, no deprecation warnings
- **Multer v2** — patched security vulnerabilities vs v1

---

## Infrastructure

| Service | Purpose |
|---------|---------|
| Supabase PostgreSQL | `photos` table — metadata storage |
| Supabase Storage | `portfolio` bucket — image file storage |
| Supabase (service-role) | Backend-only privileged access |

---

## Dev Tools

| Tool | Purpose |
|------|---------|
| pnpm | Frontend package manager |
| npm | Backend package manager |
| Git | Version control |
| GitHub | Remote repository (`m-hamza7/HAMZA.JPEG`) |
| Obsidian | This documentation vault |

---

## Package Managers Note

The **frontend** uses `pnpm` (`pnpm run dev`).  
The **backend** uses `npm` (`npm run dev` inside `backend/`).  
They are independent — different `node_modules`, different lock files.

---

## Related

- [[02 Architecture]]
- [[Backend/Setup]]

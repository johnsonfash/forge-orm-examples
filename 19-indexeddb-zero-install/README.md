# 19 · IndexedDB (zero install)

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/johnsonfash/forge-orm-examples/tree/main/19-indexeddb-zero-install)

The whole forge-orm surface, running on IndexedDB. No wasm, no worker, no bundler plugin, no COOP / COEP headers. Ships in every browser since 2017.

## What this shows

- **CRUD** — schema declared with `f.string()` / `f.text()` / `f.geoPoint()` / `f.vector(8)`, driven by `db.cafe.findMany / create / update / delete`.
- **Full-text search** — `.searchable()` fields backed by a multiEntry token index; `where: { description: { search: 'espresso wooden' } }` is AND-of-tokens.
- **Geo** — `f.geoPoint()` + `withinMeters` filter + `orderBy nearTo`, annotating each row with `_distanceMeters` after the Haversine post-filter.
- **Vector similarity** — `f.vector(8, { metric: 'cosine' })` + `orderBy nearTo: { vector: … }` for brute-force cosine re-ranking. Move the sliders and watch the list re-order live.
- **Migrations** — `db.$migrate()` runs at boot; IDB's native `onupgradeneeded` handles non-destructive schema evolution.

## Run locally

```sh
npm install
npm run dev
```

Or open the StackBlitz link at the top — the same code runs unmodified inside a sandboxed iframe, because there are no cross-origin isolated headers to negotiate.

## Files

- `src/db.ts` — schema + `indexedDbDriver()` wiring (~50 lines).
- `src/App.tsx` — React UI with four tabs, one per capability.
- `vite.config.ts` — just `@vitejs/plugin-react`. No `forgeWasm()` needed.

## IndexedDB vs sqlite-wasm — when to reach for which

| | IndexedDB (this example) | sqlite-wasm (`01-sqlite-browser-todo`) |
|---|---|---|
| Install cost | 0 KB | ~1.2 MB wasm |
| Bundler wiring | none | `forgeWasm()` Vite plugin + COOP/COEP |
| StackBlitz / sandboxed iframes | ✅ | ⚠️ OPFS blocked in some sandboxes |
| Real SQL | ❌ (planner compiles to IDB) | ✅ |
| Query language | forge-orm Prisma-shape | forge-orm Prisma-shape + `.compile()` for raw SQL |
| Speed on 100 k rows, indexed | ≈ | ≈ (SQL edges out) |
| Speed on 100 k rows, complex joins | Slower | Faster |
| Aggregations, window functions | Client-side JS | Native SQL |

Rule of thumb: **default to IndexedDB** for offline caches, local-first apps, and demos. Reach for the sqlite-wasm adapter when you already know you'll want raw SQL, window functions, or heavier joins.

Full deep-dive: **[forge-orm docs/INDEXEDDB.md](https://github.com/johnsonfash/forge-orm/blob/main/docs/INDEXEDDB.md)**.

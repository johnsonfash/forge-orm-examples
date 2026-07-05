# 19 · IndexedDB (zero install)

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/johnsonfash/forge-orm-examples/tree/main/19-indexeddb-zero-install)

forge-orm running on IndexedDB — no wasm, no worker, no bundler plugin, no COOP / COEP headers. Works in every browser since 2017.

The demo is a single sequential script that walks the API. Load the page, read `src/main.ts` top-to-bottom.

## What it covers

- **CRUD** — `create`, `createMany`, `delete`
- **Read + pagination** — `findMany({ take, skip, orderBy })`
- **Geo filter** — `f.geoPoint()` + `where: { location: { near: { lng, lat, withinMeters } } }` + `orderBy nearTo` (returns `_distanceMeters`)
- **Vector search** — `f.vector(4, { metric: 'cosine' })` + `orderBy nearTo: [ … ]` (returns `_distance`)

That's it. Three files:

| | |
|---|---|
| `src/db.ts` | schema (5 fields) + `openDb()` |
| `src/main.ts` | the sequential demo |
| `index.html` | mounts the log `<pre>` |

## Run locally

```sh
npm install
npm run dev
```

Or open the StackBlitz link at the top — the same code runs unmodified inside a sandboxed iframe.

## Full deep-dive

**[forge-orm docs/INDEXEDDB.md](https://github.com/johnsonfash/forge-orm/blob/main/docs/INDEXEDDB.md)** — planner, migrations, FTS, MultiPolygon geo, vector metrics, capability differences vs sqlite-wasm.

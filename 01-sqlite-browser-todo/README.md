# 01 · SQLite browser todo

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/johnsonfash/forge-orm-examples/tree/main/01-sqlite-browser-todo)

The "hello world" of `forge-orm` in the browser. A real SQLite database lives in OPFS (Origin Private File System) inside the tab — every CRUD operation is real SQL through `sqlite-wasm`, no network involved.

## What this shows

- Browser-side schema definition with `f.string()` / `f.bool()` / `f.dateTime()`
- `wasmSqliteDriver` + Vite's `forgeWasm` plugin wiring
- `db.$migrate()` for runtime DDL (no separate migration step)
- The same `db.todo.create / findMany / update / delete` API as the backend

## Run locally

```sh
npm install
npm run dev
```

Open the browser, add todos, refresh — they're still there. To wipe: DevTools → Application → Storage → Clear site data.

## Files

- `src/db.ts` — schema + driver wiring (15 lines)
- `src/App.tsx` — React UI calling forge-orm directly
- `vite.config.ts` — `forgeWasm()` plugin for wasm + OPFS headers

## When to use the browser adapter

- **Offline-first apps** — full SQL in the tab, no server required
- **Local-first** — sync to a backend lazily
- **Demos / prototypes** — no DB to set up
- **Privacy-sensitive** — data never leaves the device

Pair with `02-sqlite-browser-offline-first` for the optimistic-UI + sync pattern.

# forge-orm examples

Hands-on, runnable examples for [forge-orm](https://github.com/johnsonfash/forge-orm) — Prisma-shape multi-database ORM for MongoDB, PostgreSQL, MySQL, SQLite, DuckDB, and SQL Server from one codebase.

Every example is **self-contained** (its own `package.json`) and **embeddable** — click "Open in StackBlitz" to run it in your browser without installing anything.

## Browser-runnable (zero setup)

| # | Example | Dialect | Framework | What it shows |
|---|---|---|---|---|
| 01 | [sqlite-browser-todo](./01-sqlite-browser-todo) | SQLite (wasm + OPFS) | Vite + React | The "hello world" — schema, query, mutate in a tab |
| 02 | [sqlite-browser-offline-first](./02-sqlite-browser-offline-first) | SQLite (wasm + OPFS) | Vite + React | Optimistic UI + queued sync stub |
| 03 | [duckdb-analytics-browser](./03-duckdb-analytics-browser) | DuckDB (wasm) | Vite + React | Aggregations + columnar reads in the tab |
| 04 | [node-sqlite-cli](./04-node-sqlite-cli) | SQLite (native) | Plain Node | Smallest possible forge-orm program |
| 05 | [hono-pglite-api](./05-hono-pglite-api) | Postgres (PGlite) | Hono | REST CRUD with no external DB |
| 06 | [nextjs-pglite-fullstack](./06-nextjs-pglite-fullstack) | Postgres (PGlite) | Next.js App Router | Server actions + RSC reads |
| 07 | [bun-sqlite-blog](./07-bun-sqlite-blog) | SQLite (native) | Bun | Bun's native SQLite driver |

## Feature showcases

| # | Example | Highlights |
|---|---|---|
| 08 | [geo-search](./08-geo-search) | `f.geoPoint` + `nearTo` — "restaurants near me" with PostGIS |
| 09 | [vector-rag](./09-vector-rag) | `f.vector(N)` + cosine similarity — tiny RAG search |
| 10 | [recipe-bom](./10-recipe-bom) | Recursive BOM with sub-recipes (food, manufacturing) |
| 11 | [multi-tenant](./11-multi-tenant) | Row-level scoping by `orgId` everywhere |
| 12 | [audit-log](./12-audit-log) | Mutation log via `respond()` hook |
| 13 | [fulltext-search](./13-fulltext-search) | `f.search()` — same API across Postgres + Mongo |
| 14 | [transactions](./14-transactions) | Atomic batch + nested savepoints |
| 15 | [migrations-drift](./15-migrations-drift) | `db.$migrate()` + drift detection |

## Real-DB (point at your own)

| # | Example | Dialect | Setup |
|---|---|---|---|
| 16 | [mongo-atlas-blog](./16-mongo-atlas-blog) | MongoDB | Free Atlas tier — paste your URI into `.env` |
| 17 | [mssql-merge-erp](./17-mssql-merge-erp) | SQL Server | Docker run mssql, paste URI |
| 18 | [postgres-rls-auth](./18-postgres-rls-auth) | Postgres | Local docker or Neon |

## How to use

**Try in the browser** — every example has a "Run in StackBlitz" button at the top of its README. WebContainers spin up a real Node.js, run `npm install`, and start the dev server.

**Clone locally** — copy any folder:

```sh
npx degit johnsonfash/forge-orm-examples/01-sqlite-browser-todo my-app
cd my-app && npm install && npm run dev
```

**Scaffold from CLI** — the same repos back `npx create-forge-app`:

```sh
npx create-forge-app my-app --template hono-pglite-api
```

## Conventions

- Each example pins the latest `forge-orm` version
- TypeScript by default, JS where it's clearer
- README explains the **forge-orm-specific bits** — not the framework
- One concept per example so you can find what you want fast
- Comments call out trade-offs (when to use which dialect)

## Adding an example

PRs welcome. Use the existing folders as templates and aim for **under 100 LOC** of meaningful code per example. Heavy framework boilerplate goes in the `lib/` or `scripts/` folder; the demo file should be readable in one screen.

# forge-orm examples

Hands-on, runnable examples for [forge-orm](https://github.com/johnsonfash/forge-orm) — Prisma-shape multi-database ORM for MongoDB, PostgreSQL, MySQL, SQLite, DuckDB, and SQL Server from one codebase.

Every example is **self-contained** (its own `package.json`). Click the right button on each example's README and it runs — no install on your machine.

## Runs in StackBlitz (instant, no signup)

Pure-JS / wasm stacks — boots in your browser tab.

| # | Example | Dialect | Framework | What it shows |
|---|---|---|---|---|
| 01 | [sqlite-browser-todo](./01-sqlite-browser-todo) | SQLite (wasm + OPFS) | Vite + React | "Hello world" — schema, query, mutate in a tab |
| 02 | [sqlite-browser-offline-first](./02-sqlite-browser-offline-first) | SQLite (wasm + OPFS) | Vite + React | Optimistic UI + queued sync stub |
| 04 | [node-cli](./04-node-cli) | Postgres (PGlite) | Plain Node | Smallest possible forge-orm program |
| 05 | [hono-pglite-api](./05-hono-pglite-api) | Postgres (PGlite) | Hono | REST CRUD with no external DB |
| 06 | [nextjs-pglite-fullstack](./06-nextjs-pglite-fullstack) | Postgres (PGlite) | Next.js App Router | Server actions + RSC reads |
| 08 | [geo-search](./08-geo-search) | Postgres (PGlite) | Plain Node | `f.geoPoint` + `nearTo` |
| 09 | [vector-rag](./09-vector-rag) | Postgres (PGlite) | Plain Node | `f.vector(N)` + cosine similarity |
| 10 | [recipe-bom](./10-recipe-bom) | Postgres (PGlite) | Plain Node | Recursive BOM with sub-recipes |
| 11 | [multi-tenant](./11-multi-tenant) | Postgres (PGlite) | Plain Node | Row-level scoping by `orgId` |
| 12 | [audit-log](./12-audit-log) | Postgres (PGlite) | Plain Node | Mutation log via `db.$on("query")` |
| 13 | [fulltext-search](./13-fulltext-search) | Postgres (PGlite) | Plain Node | `f.text().searchable()` |
| 14 | [transactions](./14-transactions) | Postgres (PGlite) | Plain Node | Atomic batch + nested savepoints |
| 15 | [migrations-drift](./15-migrations-drift) | Postgres (PGlite) | Plain Node | `db.$migrate()` + `db.$diff()` |

## Needs a cloud VM (native `.node` addons — won't load in WebContainer)

| # | Example | Dialect | Where to run it |
|---|---|---|---|
| 03 | [duckdb-cli-needs-vm](./03-duckdb-cli-needs-vm) | DuckDB | CodeSandbox DevBox, Codespaces, Gitpod |
| 07 | [bun-cli-needs-vm](./07-bun-cli-needs-vm) | SQLite (Bun) | CodeSandbox DevBox, Replit, Codespaces |

Each README links to the free VM-backed sandbox.

## Needs a real DB server

| # | Example | Dialect | Setup |
|---|---|---|---|
| 16 | [mongo-atlas-blog](./16-mongo-atlas-blog) | MongoDB | Free Atlas tier — paste URI into `.env` |
| 17 | [mssql-merge-erp](./17-mssql-merge-erp) | SQL Server | Docker or Azure free tier |
| 18 | [postgres-rls-auth](./18-postgres-rls-auth) | Postgres | Docker, Neon, Supabase, or Codespaces |

Open the repo in **[GitHub Codespaces](https://codespaces.new/johnsonfash/forge-orm-examples?devcontainer_path=.devcontainer/devcontainer.json)** — the included [`.devcontainer/`](./.devcontainer) auto-starts all three DBs on standard ports with pre-set `DATABASE_URL_*` env vars.

## Sandbox-environment cheat sheet

| Service | Free tier | What it gives you | Best for |
|---|---|---|---|
| **[StackBlitz](https://stackblitz.com)** | Unlimited | Browser-only Node (WebContainer) | Examples 01, 02, 04, 05, 06, 08–15 |
| **[CodeSandbox DevBox](https://codesandbox.io)** | Public projects free | Real cloud VM | DuckDB, Bun, anything native |
| **[GitHub Codespaces](https://codespaces.new)** | 60 hrs/month | Linux VM + docker-in-docker | DB-server examples (16–18) |
| **[Gitpod](https://gitpod.io)** | 50 hrs/month | Linux VM | Same as Codespaces |
| **[Replit](https://replit.com)** | Free (slower) | Container with Bun pre-installed | Bun example (07) |

## Clone locally

```sh
npx degit johnsonfash/forge-orm-examples/04-node-cli my-app
cd my-app && npm install && npm run dev
```

## Conventions

- Each example pins the latest `forge-orm` version
- TypeScript by default
- README explains the **forge-orm-specific bits**, not the framework
- One concept per example
- Comments call out trade-offs

## Adding an example

PRs welcome. Use the existing folders as templates. Aim for under 100 LOC of meaningful code per example.

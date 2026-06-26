# Server-DB test environment

The 18 examples split into two run modes:

## Runs in StackBlitz (no setup) — examples 04–15

WebContainers ship Node + npm. Every example that uses an in-process DB just works:

- **04 node-sqlite-cli** — better-sqlite3 in WebContainer
- **05 hono-pglite-api** — Postgres-wasm (PGlite) in WebContainer
- **06 nextjs-pglite-fullstack** — same
- **08 geo-search**, **09 vector-rag**, **11 multi-tenant**, **13 fulltext-search** — PGlite
- **10 recipe-bom**, **12 audit-log**, **14 transactions**, **15 migrations-drift** — file-SQLite

Click the StackBlitz button on each example's README.

## Needs a real DB — examples 16, 17, 18

These need MongoDB / SQL Server / Postgres servers. Three ways to run them:

### Option 1 — GitHub Codespaces (one click)

Go to the repo, click **Code → Create codespace on main**. The devcontainer spec in this folder spins up:

- Postgres 16 on `:5432`
- MongoDB 7 on `:27017`
- SQL Server 2022 on `:1433`

Connection strings are pre-set in the environment (`DATABASE_URL_PG`, `DATABASE_URL_MONGO`, `DATABASE_URL_MSSQL`). Each example's `.env.example` shows which one to copy.

### Option 2 — Gitpod

Open this repo in Gitpod. The devcontainer config is the same shape, Gitpod respects it. Wait ~60s for the containers to come up, then `cd 18-postgres-rls-auth && npm install && npm run dev`.

### Option 3 — Local Docker

If you have Docker on your machine:

```sh
docker compose -f .devcontainer/docker-compose.yml up -d
# Wait until `docker compose ps` shows all three healthy
cd 18-postgres-rls-auth
echo 'DATABASE_URL=postgres://postgres:postgres@localhost:5432/forge' > .env
npm install && npm run dev
```

Same for `16-mongo-atlas-blog` (use the Mongo URI) and `17-mssql-merge-erp` (use the MSSQL URI).

## Free hosted DBs (no local setup at all)

If you don't want Codespaces / Docker either, hosted free-tier options work fine — point `.env` at any of these:

| Dialect | Free tier | Connection-string shape |
|---|---|---|
| Postgres | [Neon](https://neon.tech), [Supabase](https://supabase.com), [Aiven](https://aiven.io) | `postgres://user:pass@host/db?sslmode=require` |
| MongoDB | [Atlas free tier](https://www.mongodb.com/cloud/atlas/register) | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| MySQL  | [PlanetScale](https://planetscale.com), [Aiven](https://aiven.io) | `mysql://user:pass@host/db` |
| SQL Server | Azure SQL free tier (12 months) | `mssql://user:pass@host:1433/db` |

Same forge-orm code in every example — the only change is the URL in `.env`.

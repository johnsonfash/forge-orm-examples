# Server-DB test environment

The 18 examples split into three run modes:

## Runs in StackBlitz (no setup) — examples 01, 02, 04, 05, 06, 08–15

Pure-JS / wasm stacks. Click any `Open in StackBlitz` button.

## Needs a real OS (native bindings) — examples 03, 07

DuckDB and Bun use native `.node` addons. Use **GitHub Codespaces**:

```sh
# Once the Codespace boots (Codespaces does NOT auto-start the DB containers)
cd 03-duckdb-cli-needs-vm
npm install && npm run dev
```

Boots in ~20–30s. No DB containers needed.

## Needs a real DB server — examples 16, 17, 18

These need MongoDB / SQL Server / Postgres. Spin them up explicitly when you want them:

```sh
docker compose -f .devcontainer/docker-compose.yml up -d
# Wait until `docker compose ps` shows all three healthy (~60s for MSSQL)
cd 18-postgres-rls-auth
npm install && npm run dev
```

Connection strings are pre-set in the Codespace environment (`DATABASE_URL_PG`, `DATABASE_URL_MONGO`, `DATABASE_URL_MSSQL`).

To stop the containers when done:

```sh
docker compose -f .devcontainer/docker-compose.yml down
```

## Why aren't the DB containers auto-started?

Earlier the devcontainer ran `docker compose up -d` as a `postCreateCommand`, which forced every Codespace boot to download ~3GB of Postgres + Mongo + MSSQL images and wait for MSSQL to be healthy — even if you were just running the DuckDB example. Now the containers are opt-in so DuckDB / Bun boots are fast.

## Free hosted DBs (no Docker at all)

Hosted free-tier options work the same — point `.env` at any of these:

| Dialect | Free tier | Connection-string shape |
|---|---|---|
| Postgres | [Neon](https://neon.tech), [Supabase](https://supabase.com), [Aiven](https://aiven.io) | `postgres://user:pass@host/db?sslmode=require` |
| MongoDB | [Atlas free tier](https://www.mongodb.com/cloud/atlas/register) | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| MySQL  | [PlanetScale](https://planetscale.com), [Aiven](https://aiven.io) | `mysql://user:pass@host/db` |
| SQL Server | Azure SQL free tier (12 months) | `mssql://user:pass@host:1433/db` |

Same forge-orm code in every example — the only change is the URL in `.env`.

## Tips to make Codespaces faster

- **Pick a closer region** — Codespaces → Settings → Default region. Picking Europe / Asia gets you ~50–100ms latency instead of 300ms from outside the US.
- **Upgrade the machine** — 4-core / 16GB is ~2× faster on `npm install`. Costs 2× the free-hour rate (still well within 60 hrs/month for casual use).
- **Stop the codespace when idle** — Codespaces auto-stop after 30 min of inactivity by default; you can lower this in settings so you don't burn hours.
- **Prebuild** — for repeat use, enable GitHub prebuilds on the repo: every commit produces a ready-to-attach image, so boot drops to ~10s.

# 03 · DuckDB analytics

Seeds 5,000 sales rows into an in-process DuckDB and runs aggregations. Demonstrates columnar storage + vectorised execution for OLAP workloads, plus the cross-dialect `groupBy` API and `$queryRaw` escape hatch.

## Run it

DuckDB's Node bindings ship a native `.node` addon, so this example needs a real OS — not StackBlitz. All free:

- **[Open in GitHub Codespaces](https://codespaces.new/johnsonfash/forge-orm-examples?devcontainer_path=.devcontainer/devcontainer.json)** — 60 free hrs/month. After it boots:
  ```sh
  cd 03-duckdb-cli-needs-vm && npm install && npm run dev
  ```
- **[Open in Gitpod](https://gitpod.io/#https://github.com/johnsonfash/forge-orm-examples)** — 50 free hrs/month. Same `cd && npm install && npm run dev` after boot.
- **Locally** —
  ```sh
  npx degit johnsonfash/forge-orm-examples/03-duckdb-cli-needs-vm my-duckdb-demo
  cd my-duckdb-demo && npm install && npm run dev
  ```

Prints two reports: top products by units sold + revenue by city.

## What this shows

- `url: "duckdb::memory:"` — DuckDB embedded, no server
- `db.sale.createMany({ data: [...] })` — bulk insert
- `groupBy({ by, _sum, orderBy })` — typed aggregation API
- ``db.$queryRaw`...` `` — raw SQL when you want the dialect's full power

## When to pick DuckDB

- Ad-hoc analytics on local data (parquet, CSV, JSON)
- ETL stage before pushing to a warehouse
- Embedded analytics inside desktop / CLI apps
- BI-style queries that would be slow on row-stores

> **Browser DuckDB**: forge-orm currently ships only the Node adapter (`@duckdb/node-api`). For in-browser DuckDB use `@duckdb/duckdb-wasm` directly; a forge-orm browser-DuckDB adapter is on the roadmap.

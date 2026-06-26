# 03 · DuckDB analytics

Seeds 5,000 sales rows into in-process DuckDB and runs aggregations. Demonstrates columnar storage + vectorised execution for OLAP, plus the cross-dialect `groupBy` API and `$queryRaw` escape hatch.

## Run it (no typing — auto-runs on click)

DuckDB's Node bindings ship a native `.node` addon, so this needs a real OS — not StackBlitz. Three click-and-run options:

- **[Run on Replit](https://replit.com/new/github/johnsonfash/forge-orm-examples)** — auto-runs from `.replit` config. Pick the `03-duckdb-cli-needs-vm` folder, hit Run, see the output. Free, has Asia + Europe datacenters (faster from Nigeria than Codespaces).
- **[Run on CodeSandbox](https://codesandbox.io/p/devbox/github/johnsonfash/forge-orm-examples/main/03-duckdb-cli-needs-vm)** — `.codesandbox/tasks.json` auto-installs + runs. Sign-in required, free for public repos.
- **[Open in GitHub Codespaces](https://codespaces.new/johnsonfash/forge-orm-examples?devcontainer_path=.devcontainer/devcontainer.json)** — boots VS Code. Manually: `cd 03-duckdb-cli-needs-vm && npm install && npm run dev`.

Fastest of all is local:

```sh
npx degit johnsonfash/forge-orm-examples/03-duckdb-cli-needs-vm my-demo
cd my-demo && npm install && npm run dev
```

## What this shows

- `url: "duckdb::memory:"` — DuckDB embedded
- `db.sale.createMany({ data: [...] })` — bulk insert
- `groupBy({ by, _sum, orderBy })` — typed aggregation API
- ``db.$queryRaw`...` `` — raw SQL escape hatch

## When to pick DuckDB

- Ad-hoc analytics on local data (parquet, CSV, JSON)
- ETL before pushing to a warehouse
- Embedded analytics in desktop / CLI apps
- BI-style queries that would be slow on row-stores

> **Browser DuckDB**: forge-orm currently ships only the Node adapter (`@duckdb/node-api`). For in-browser DuckDB use `@duckdb/duckdb-wasm` directly; a forge-orm browser-DuckDB adapter is on the roadmap.

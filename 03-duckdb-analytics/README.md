# 03 · DuckDB analytics

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/johnsonfash/forge-orm-examples/tree/main/03-duckdb-analytics)

Seeds 5,000 sales rows into an in-process DuckDB and runs aggregations. Demonstrates columnar storage + vectorised execution for OLAP workloads, plus the cross-dialect `groupBy` API and `$queryRaw` escape hatch.

## What this shows

- `url: "duckdb::memory:"` — DuckDB embedded, no server
- `db.sale.createMany({ data: [...] })` — bulk insert
- `groupBy({ by, _sum, orderBy })` — typed aggregation API
- `db.$queryRaw\`...\`` — raw SQL when you want the dialect's full power

## Run

```sh
npm install && npm run dev
```

Prints two reports: top products by units sold + revenue by city.

## When to pick DuckDB

- Ad-hoc analytics on local data (parquet, CSV, JSON)
- ETL stage before pushing to a warehouse
- Embedded analytics inside desktop / CLI apps
- BI-style queries that would be slow on row-stores

> **Browser DuckDB**: forge-orm currently ships only the Node adapter (`@duckdb/node-api`). For in-browser DuckDB use the `@duckdb/duckdb-wasm` package directly; a forge-orm browser-DuckDB adapter is on the roadmap.

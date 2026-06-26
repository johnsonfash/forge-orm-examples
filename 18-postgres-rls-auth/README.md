# 18 · Postgres Row-Level Security

Hard multi-tenant isolation enforced by the database, not the app. Even if your code forgets to filter by `orgId`, RLS prevents the leak.

Setup:

```sh
docker run -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16
cp .env.example .env
npm install && npm run dev
```

For soft RLS (app-layer filter, no DB enforcement), see `11-multi-tenant`.

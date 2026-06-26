# 17 · MSSQL with MERGE upsert

Run SQL Server locally:

```sh
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=YourStrong!Passw0rd" \
  -p 1433:1433 -d mcr.microsoft.com/mssql/server:2022-latest
```

Then `cp .env.example .env && npm install && npm run dev`. The `upsert` call lowers to a single `MERGE` statement on MSSQL — atomic and race-safe.

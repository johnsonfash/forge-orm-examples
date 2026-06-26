// SQL Server example — uses MERGE under the hood for upsert.
// Run with: docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=YourStrong!Passw0rd" -p 1433:1433 mcr.microsoft.com/mssql/server:2022-latest

import { createDb, f } from "forge-orm"

const Item = f.model({
  id:    f.string().id().default("uuid"),
  sku:   f.string().unique(),
  name:  f.string(),
  stock: f.int().default(0),
})

const url = process.env.DATABASE_URL
if (!url) {
  console.error("Set DATABASE_URL (mssql://...) in .env")
  process.exit(1)
}

const db = await createDb({ url, schema: { item: Item } })
await db.$migrate()

// Idempotent upsert — on MSSQL this lowers to a single MERGE statement.
const widget = await db.item.upsert({
  where:  { sku: "WID-001" },
  create: { sku: "WID-001", name: "Widget A", stock: 100 },
  update: { stock: { increment: 50 } },
})

console.log("widget:", widget)
console.log("inventory:", await db.item.findMany())

// Runtime migrations + drift detection. db.$migrate() is idempotent —
// safe to call on every boot. db.$diff() reports what the schema
// wants vs. what's on disk so you can show drift in your admin UI.

import { createDb, f } from "forge-orm"

const User = f.model({
  id:        f.string().id().default("uuid"),
  email:     f.string().unique(),
  name:      f.string(),
  createdAt: f.dateTime().default("now"),
})

const db = await createDb({
  url: "file:./drift.db",
  schema: { user: User },
})

// First call: creates the table.
// Second call: no-op (idempotent).
// After adding a new optional column to the model: ALTER TABLE.
const report = await db.$migrate({ logger: (l) => console.log("[migrate]", l) })
console.log("applied:", report.tables, "tables,", report.indexes, "indexes")
console.log("altered:", report.alteredColumns)

// What does the running DB look like vs. the schema?
const diff = await db.$diff()
console.log("drift:", diff)

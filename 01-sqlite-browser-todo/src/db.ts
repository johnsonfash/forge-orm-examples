// Browser-side forge-orm. The data lives in OPFS so it survives page
// reloads and tab restarts. Schema is just a single Todo table; add
// more in this file and the UI types update automatically.

import { createDb, f } from "forge-orm"
import { wasmSqliteDriver } from "forge-orm/wasm"
import SqliteWorker from "forge-orm/wasm/worker?worker"

const Todo = f.model({
  id:        f.string().id().default("uuid"),
  title:     f.string(),
  done:      f.bool().default(false),
  createdAt: f.dateTime().default("now"),
})

const driver = wasmSqliteDriver({
  worker: new SqliteWorker(),
  // OPFS = Origin Private File System. Survives reload + tab close.
  // Swap to `:memory:` for a throwaway DB.
  url: "opfs:/todo.db",
})

export const db = await createDb({
  driver,
  schema: { todo: Todo },
})

// Idempotent: applies missing tables/indexes on every boot.
await db.$migrate()

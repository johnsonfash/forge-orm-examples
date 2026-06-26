// Browser-side forge-orm. The data lives in OPFS so it survives page
// reloads and tab restarts.

import { createDb, f, model } from "forge-orm"
import { wasmSqliteDriver } from "forge-orm/wasm"

const Todo = model("todos", {
  id:        f.id({ type: "uuid" }),
  title:     f.string(),
  done:      f.bool().default(false),
  createdAt: f.dateTime().default("now"),
})

const driver = wasmSqliteDriver({
  // The Vite plugin in vite.config.ts wires up the worker bundle.
  worker: new Worker(new URL("forge-orm/wasm/worker", import.meta.url), { type: "module" }),
  // OPFS = Origin Private File System — persists across reloads.
  // Use `:memory:` for a throwaway DB.
  url: "opfs:/todo.db",
})

export const db = await createDb({
  driver,
  schema: { todo: Todo },
})

// Idempotent: applies missing tables/indexes on every boot.
await db.$migrate()

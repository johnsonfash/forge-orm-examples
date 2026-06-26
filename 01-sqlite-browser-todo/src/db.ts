// Browser-side forge-orm. Data lives in OPFS so it survives page
// reloads and tab restarts. Lazy singleton — boots once on first use.

import { createDb, f, model, wasmSqliteDriver } from "forge-orm"

const Todo = model("todos", {
  id:        f.id({ type: "uuid" }),
  title:     f.string(),
  done:      f.bool().default(false),
  createdAt: f.dateTime().default("now"),
})

export const schema = { todo: Todo }

let dbPromise: ReturnType<typeof open> | null = null

function open() {
  // Vite bundles the worker thanks to forgeWasm() in vite.config.ts.
  const worker = new Worker(
    new URL("forge-orm/wasm/worker", import.meta.url),
    { type: "module" },
  )
  return createDb({
    schema,
    driver: wasmSqliteDriver({
      worker,
      // opfs-sahpool is the canonical OPFS scheme — survives reloads.
      // Swap to ":memory:" for a throwaway in-memory DB.
      url: "opfs-sahpool:///todo.sqlite",
    }),
  })
}

export function getDb() {
  if (!dbPromise) dbPromise = open()
  return dbPromise
}

// Idempotent — safe to call on every app boot.
export async function bootDb() {
  const db = await getDb()
  if (navigator.storage?.persist) await navigator.storage.persist()
  await db.$migrate()
  return db
}

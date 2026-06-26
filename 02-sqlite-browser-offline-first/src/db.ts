// Offline-first pattern. Writes go straight to the local SQLite DB;
// a separate `outbox` table queues the same op for later server sync.
//
// This example uses `:memory:` so it runs in sandboxed iframes
// (StackBlitz). For real offline-first persistence switch the `url`
// to `"opfs-sahpool:///offline.sqlite"` and data survives reloads.

import { createDb, f, model, wasmSqliteDriver } from "forge-orm"

const Note = model("notes", {
  id:        f.id({ type: "uuid" }),
  text:      f.text(),
  syncedAt:  f.dateTime().optional(),
  updatedAt: f.dateTime().default("now").updatedAt(),
})

const Outbox = model("outbox", {
  id:        f.id({ type: "uuid" }),
  noteId:    f.string(),
  op:        f.string(),
  payload:   f.json(),
  queuedAt:  f.dateTime().default("now"),
  tries:     f.int().default(0),
})

export const schema = { note: Note, outbox: Outbox }

let dbPromise: ReturnType<typeof open> | null = null
function open() {
  const worker = new Worker(
    new URL("forge-orm/wasm/worker", import.meta.url),
    { type: "module" },
  )
  return createDb({
    schema,
    driver: wasmSqliteDriver({
      worker,
      // Demo-friendly default. Use `"opfs-sahpool:///offline.sqlite"`
      // in production.
      url: ":memory:",
    }),
  })
}
export function getDb() {
  if (!dbPromise) dbPromise = open()
  return dbPromise
}
export async function bootDb() {
  const db = await getDb()
  if (navigator.storage?.persist) await navigator.storage.persist()
  await db.$migrate()
  return db
}

// Offline-first pattern: writes hit OPFS immediately (optimistic UI),
// an `outbox` table queues the same op for later server sync. A
// background loop drains the outbox when online. Lazy singleton.

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
    driver: wasmSqliteDriver({ worker, url: "opfs-sahpool:///offline.sqlite" }),
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

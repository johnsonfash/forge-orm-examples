// Offline-first pattern: every mutation hits OPFS sqlite IMMEDIATELY
// (optimistic UI), and a separate `outbox` table queues the same op
// for later sync. A background loop drains the outbox when online.

import { createDb, f, model } from "forge-orm"
import { wasmSqliteDriver } from "forge-orm/wasm"

const Note = model("notes", {
  id:        f.id({ type: "uuid" }),
  text:      f.text(),
  syncedAt:  f.dateTime().optional(),
  updatedAt: f.dateTime().default("now").updatedAt(),
})

// Outbox — pending mutations that haven't reached the server yet.
const Outbox = model("outbox", {
  id:        f.id({ type: "uuid" }),
  noteId:    f.string(),
  op:        f.string(),
  payload:   f.json(),
  queuedAt:  f.dateTime().default("now"),
  tries:     f.int().default(0),
})

export const db = await createDb({
  driver: wasmSqliteDriver({
    worker: new Worker(new URL("forge-orm/wasm/worker", import.meta.url), { type: "module" }),
    url:    "opfs:/offline.db",
  }),
  schema: { note: Note, outbox: Outbox },
})
await db.$migrate()

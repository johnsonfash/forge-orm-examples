// Offline-first pattern: every mutation hits OPFS sqlite IMMEDIATELY
// (optimistic UI), and a separate `outbox` table queues the same op
// for later sync. A background loop drains the outbox when online.

import { createDb, f } from "forge-orm"
import { wasmSqliteDriver } from "forge-orm/wasm"
import SqliteWorker from "forge-orm/wasm/worker?worker"

const Note = f.model({
  id:        f.string().id().default("uuid"),
  text:      f.text(),
  syncedAt:  f.dateTime().optional(),
  updatedAt: f.dateTime().default("now").updatedAt(),
})

// Outbox — pending mutations that haven't reached the server yet.
const Outbox = f.model({
  id:        f.string().id().default("uuid"),
  noteId:    f.string(),
  op:        f.string(), // "create" | "update" | "delete"
  payload:   f.json(),
  queuedAt:  f.dateTime().default("now"),
  tries:     f.int().default(0),
})

export const db = await createDb({
  driver: wasmSqliteDriver({ worker: new SqliteWorker(), url: "opfs:/offline.db" }),
  schema: { note: Note, outbox: Outbox },
})
await db.$migrate()

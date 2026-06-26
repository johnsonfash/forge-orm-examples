// Single global db instance (Next.js hot-reload safe).

import { createDb, f } from "forge-orm"

const Task = f.model({
  id:        f.string().id().default("uuid"),
  title:     f.string(),
  done:      f.bool().default(false),
  createdAt: f.dateTime().default("now"),
})

const globalForDb = globalThis as unknown as { db?: Awaited<ReturnType<typeof createDb<{ task: typeof Task }>>> }

export const db =
  globalForDb.db ??
  (await createDb({ url: "pglite:./.pgdata", schema: { task: Task } }))

if (!globalForDb.db) {
  await db.$migrate()
  globalForDb.db = db
}

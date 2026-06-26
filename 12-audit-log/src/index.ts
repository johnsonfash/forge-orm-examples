// Audit log — capture every mutation by wrapping the db with an event
// listener. The `events()` hook fires on every create/update/delete.

import { createDb, f } from "forge-orm"

const Invoice = f.model({
  id:     f.string().id().default("uuid"),
  number: f.string().unique(),
  total:  f.float(),
  paid:   f.bool().default(false),
})

const AuditEntry = f.model({
  id:        f.string().id().default("uuid"),
  model:     f.string(),
  op:        f.string(),
  rowId:     f.string(),
  diff:      f.json(),
  at:        f.dateTime().default("now"),
  actorId:   f.string().optional(),
})

const db = await createDb({
  url: "file:./audit.db",
  schema: { invoice: Invoice, auditEntry: AuditEntry },
})
await db.$migrate()

// Subscribe to every mutation. In a real app the actor comes from the
// request context; here we pass it via a contextual store/closure.
let currentActor: string | undefined
db.$events.on("mutation", async (e) => {
  if (e.model === "auditEntry") return // don't audit the audit
  await db.auditEntry.create({
    data: {
      model:   e.model,
      op:      e.op,
      rowId:   e.id,
      diff:    e.diff ?? {},
      actorId: currentActor,
    },
  })
})

// Pretend we're handling a request from user-42.
currentActor = "user-42"
const inv = await db.invoice.create({
  data: { number: "INV-1001", total: 250 },
})
await db.invoice.update({
  where: { id: inv.id },
  data:  { paid: true },
})

console.log("Audit feed:")
for (const a of await db.auditEntry.findMany({ orderBy: { at: "asc" } })) {
  console.log(`  ${a.at.toISOString()} · ${a.actorId} · ${a.model}.${a.op} ${a.rowId}`)
}

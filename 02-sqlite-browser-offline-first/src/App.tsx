import React from "react"
import { db } from "./db"

export function App() {
  const [notes, setNotes] = React.useState<Awaited<ReturnType<typeof db.note.findMany>>>([])
  const [text, setText] = React.useState("")
  const [pending, setPending] = React.useState(0)

  const reload = async () => {
    setNotes(await db.note.findMany({ orderBy: { updatedAt: "desc" } }))
    setPending((await db.outbox.findMany()).length)
  }
  React.useEffect(() => { reload() }, [])

  // Background drain — pretend to sync every 5s if "online".
  React.useEffect(() => {
    const t = setInterval(async () => {
      if (!navigator.onLine) return
      const pending = await db.outbox.findMany({ orderBy: { queuedAt: "asc" }, take: 10 })
      for (const o of pending) {
        // POST to your API here. We just mark synced on success.
        await db.note.update({
          where: { id: o.noteId },
          data:  { syncedAt: new Date() },
        }).catch(() => undefined)
        await db.outbox.delete({ where: { id: o.id } })
      }
      reload()
    }, 5000)
    return () => clearInterval(t)
  }, [])

  const add = async () => {
    if (!text.trim()) return
    const note = await db.note.create({ data: { text: text.trim() } })
    await db.outbox.create({
      data: { noteId: note.id, op: "create", payload: { text: note.text } },
    })
    setText("")
    reload()
  }

  return (
    <div style={{ maxWidth: 480, margin: "40px auto", fontFamily: "system-ui" }}>
      <h1>Offline-first notes</h1>
      <p style={{ color: "#666" }}>
        Pending sync: <strong>{pending}</strong> · {navigator.onLine ? "online" : "offline"}
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Note…" style={{ flex: 1, padding: 8 }} />
        <button onClick={add}>Save</button>
      </div>
      <ul style={{ marginTop: 20 }}>
        {notes.map((n) => (
          <li key={n.id} style={{ marginBottom: 8 }}>
            {n.text} {n.syncedAt ? <small style={{ color: "green" }}>✓ synced</small> : <small style={{ color: "#999" }}>(pending)</small>}
          </li>
        ))}
      </ul>
    </div>
  )
}

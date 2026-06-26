import React from "react"
import { db } from "./db"

type Todo = Awaited<ReturnType<typeof db.todo.findMany>>[number]

export function App() {
  const [todos, setTodos] = React.useState<Todo[]>([])
  const [title, setTitle] = React.useState("")

  const reload = React.useCallback(async () => {
    setTodos(await db.todo.findMany({ orderBy: { createdAt: "desc" } }))
  }, [])

  React.useEffect(() => {
    reload()
  }, [reload])

  const add = async () => {
    if (!title.trim()) return
    await db.todo.create({ data: { title: title.trim() } })
    setTitle("")
    reload()
  }

  const toggle = async (t: Todo) => {
    await db.todo.update({ where: { id: t.id }, data: { done: !t.done } })
    reload()
  }

  const remove = async (t: Todo) => {
    await db.todo.delete({ where: { id: t.id } })
    reload()
  }

  return (
    <div style={{ maxWidth: 480, margin: "40px auto", fontFamily: "system-ui" }}>
      <h1>forge-orm · SQLite-in-a-tab</h1>
      <p style={{ color: "#666" }}>
        Data persists in OPFS — refresh the page, it's still here.
      </p>
      <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="What needs doing?"
          style={{ flex: 1, padding: "8px 12px", fontSize: 14 }}
        />
        <button onClick={add} style={{ padding: "8px 16px" }}>
          Add
        </button>
      </div>
      <ul style={{ listStyle: "none", padding: 0, marginTop: 20 }}>
        {todos.map((t) => (
          <li
            key={t.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 0",
              borderBottom: "1px solid #eee",
            }}
          >
            <input type="checkbox" checked={t.done} onChange={() => toggle(t)} />
            <span
              style={{
                flex: 1,
                textDecoration: t.done ? "line-through" : "none",
                color: t.done ? "#999" : "#000",
              }}
            >
              {t.title}
            </span>
            <button onClick={() => remove(t)} style={{ color: "#c00", border: "none", background: "none", cursor: "pointer" }}>
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

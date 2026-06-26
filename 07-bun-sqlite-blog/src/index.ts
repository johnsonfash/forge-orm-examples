// Bun's built-in SQLite — zero-dep, faster than better-sqlite3. forge-orm
// picks it up automatically when running under Bun.

import { createDb, f, rel } from "forge-orm"

const Post = f.model({
  id:        f.string().id().default("uuid"),
  title:     f.string(),
  body:      f.text(),
  authorId:  f.string(),
}).relate(() => ({
  author: rel.one("author", { on: "authorId", refs: "id" }),
}))

const Author = f.model({
  id:    f.string().id().default("uuid"),
  email: f.string().unique(),
  name:  f.string(),
}).relate(() => ({
  posts: rel.many("post", { on: "authorId", refs: "id" }),
}))

const db = await createDb({
  url: "bun-sqlite:./blog.db",
  schema: { author: Author, post: Post },
})
await db.$migrate()

const ada = await db.author.upsert({
  where:  { email: "ada@example.com" },
  create: { email: "ada@example.com", name: "Ada Lovelace" },
  update: {},
})

await db.post.create({
  data: { authorId: ada.id, title: "On loops + mathematics", body: "..." },
})

const everything = await db.author.findMany({ include: { posts: true } })
console.log(everything)

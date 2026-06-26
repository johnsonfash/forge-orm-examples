// Real Mongo (Atlas free tier). Set DATABASE_URL in .env.
// Same forge-orm API as every other dialect — the change is one URL.

import { createDb, f, rel } from "forge-orm"

const Author = f.model({
  id:    f.string().id().default("uuid"),
  email: f.string().unique(),
  name:  f.string(),
}).relate(() => ({
  posts: rel.many("post", { on: "authorId", refs: "id" }),
}))

const Post = f.model({
  id:        f.string().id().default("uuid"),
  authorId:  f.string(),
  title:     f.string(),
  body:      f.text().search(),
  tags:      f.stringArray(),
  createdAt: f.dateTime().default("now"),
}).relate(() => ({
  author: rel.one("author", { on: "authorId", refs: "id" }),
}))

const url = process.env.DATABASE_URL
if (!url) {
  console.error("Set DATABASE_URL (Mongo Atlas connection string) in .env first.")
  process.exit(1)
}

const db = await createDb({
  url,
  schema: { author: Author, post: Post },
})
await db.$migrate()

const a = await db.author.upsert({
  where:  { email: "ada@example.com" },
  create: { email: "ada@example.com", name: "Ada Lovelace" },
  update: {},
})

await db.post.create({
  data: {
    authorId: a.id,
    title:    "Notes on the Analytical Engine",
    body:     "It might act upon other things besides number...",
    tags:     ["history", "computing"],
  },
})

console.log(await db.post.findMany({ include: { author: true } }))

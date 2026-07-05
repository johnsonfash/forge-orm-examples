// forge-orm on IndexedDB — zero install.
//
// No wasm, no worker, no bundler plugin, no COOP/COEP headers. This file
// runs unmodified in every browser since 2017. Import the schema-shape
// factory and driver from `forge-orm/indexeddb` — the subpath keeps IDB
// out of any server bundle that doesn't touch it.

import { createDb, f, model } from "forge-orm"
// Registers the IDB adapter with the factory. The `idb:` URL scheme
// below routes through it.
import "forge-orm/indexeddb"

// A café roughly captures every feature the adapter ships:
//
//   • CRUD           — id / name / createdAt
//   • Full-text      — description (.searchable()) + tags (multiEntry index)
//   • Geo            — location (f.geoPoint())
//   • Vector         — vibeEmbedding (f.vector(8, { metric:'cosine' }))
//   • Relations      — reviews live in a second store, with a foreign key
//
// 8-dim vectors so the demo can hand-author test values inline. In a real
// app you'd pipe OpenAI text-embedding-3-small (1536 dims) or a small
// on-device model like MiniLM here — the adapter is metric-agnostic.

const Cafe = model("cafes", {
  id:            f.id({ type: "uuid" }),
  name:          f.string(),
  description:   f.text().searchable(),
  tags:          f.stringArray(),
  location:      f.geoPoint(),
  vibeEmbedding: f.vector(8, { metric: "cosine" }),
  rating:        f.float().default(0),
  createdAt:     f.dateTime().default("now"),
})

const Review = model("reviews", {
  id:        f.id({ type: "uuid" }),
  cafeId:    f.string(),
  author:    f.string(),
  body:      f.text().searchable(),
  stars:     f.int(),
  createdAt: f.dateTime().default("now"),
})

export const schema = { cafe: Cafe, review: Review }

// Boot the db once. React 18 StrictMode double-mounts effects in dev,
// so we memoise the promise itself — not the resolved db — to guarantee
// $migrate() runs at most once even under concurrent callers.

let bootPromise: Promise<Awaited<ReturnType<typeof openDb>>> | null = null

async function openDb() {
  // `idb:` URL scheme is the terse form; equivalent to
  // `driver: indexedDbDriver({ name: 'forge-cafes' })`.
  const db = await createDb({ schema, url: "idb:forge-cafes" })
  await db.$migrate()
  return db
}

export function bootDb() {
  if (!bootPromise) bootPromise = openDb()
  return bootPromise
}

// Wipes the IDB database — used by the "Reset demo" button so you can
// re-run the seed after inspecting the data. Clears the boot cache so
// the next call reopens a fresh handle.
export async function resetDb() {
  const db = await bootDb()
  await db.$transaction(async (tx) => {
    await tx.review.deleteMany({ where: {} })
    await tx.cafe.deleteMany({ where: {} })
  })
}

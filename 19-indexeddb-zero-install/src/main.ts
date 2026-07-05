import { openDb } from "./db"

const pre = document.getElementById("log")!
pre.textContent = ""
function log(title: string, value: unknown) {
  pre.textContent += `// ${title}\n${JSON.stringify(value, null, 2)}\n\n`
}

async function main() {
const db = await openDb()

// Wipe any prior demo run so this file is idempotent on reload.
await db.cafe.deleteMany({ where: {} } as any)

// ─── CREATE ────────────────────────────────────────────────────────────
const alice = await db.cafe.create({
  data: {
    name: "Elephant House",
    city: "Edinburgh",
    location:  { lng: -3.1901, lat: 55.9463 },
    embedding: [0.1, 0.9, 0.5, 0.2],
  } as any,
})
log("create", alice)

await db.cafe.createMany({
  data: [
    { name: "Prufrock",    city: "London",    location: { lng: -0.1085, lat: 51.5211 }, embedding: [0.4, 0.6, 0.5, 0.3] },
    { name: "Monmouth",    city: "London",    location: { lng: -0.1274, lat: 51.5148 }, embedding: [0.7, 0.3, 0.5, 0.4] },
    { name: "Bar Termini", city: "London",    location: { lng: -0.1264, lat: 51.5133 }, embedding: [0.8, 0.3, 0.6, 0.5] },
    { name: "Kaffi Vínyl", city: "Reykjavík", location: { lng: -21.9426, lat: 64.1471 }, embedding: [0.9, 0.4, 0.2, 0.8] },
  ] as any,
})

// ─── READ ──────────────────────────────────────────────────────────────
const all = await db.cafe.findMany()
log("findMany · all names", all.map((c) => c.name))

// ─── PAGINATION ────────────────────────────────────────────────────────
const page1 = await db.cafe.findMany({ take: 2, skip: 0, orderBy: { name: "asc" } })
const page2 = await db.cafe.findMany({ take: 2, skip: 2, orderBy: { name: "asc" } })
log("page 1 (take: 2, skip: 0)", page1.map((c) => c.name))
log("page 2 (take: 2, skip: 2)", page2.map((c) => c.name))

// ─── GEO ───────────────────────────────────────────────────────────────
// Find cafés within 5 km of Trafalgar Square, sorted by distance.
const me = { lng: -0.1276, lat: 51.5074 }
const nearby = await db.cafe.findMany({
  where:   { location: { near: { ...me, withinMeters: 5000 } } } as any,
  orderBy: { location: { direction: "asc", nearTo: me } } as any,
})
log("within 5 km of me", nearby.map((c) => ({
  name: c.name,
  km:   ((c as any)._distanceMeters / 1000).toFixed(2),
})))

// ─── VECTOR ────────────────────────────────────────────────────────────
// Rank by cosine distance to a query vector.
const query = [0.5, 0.5, 0.5, 0.5]
const similar = await db.cafe.findMany({
  orderBy: { embedding: { direction: "asc", nearTo: query } } as any,
  take: 3,
})
log("closest 3 by vibe", similar.map((c) => ({
  name:     c.name,
  distance: (c as any)._distance?.toFixed(3),
})))

// ─── DELETE ────────────────────────────────────────────────────────────
await db.cafe.delete({ where: { id: alice.id } })
log("after delete", (await db.cafe.findMany()).map((c) => c.name))
}

main().catch((e) => { pre.textContent = String(e?.stack ?? e) })

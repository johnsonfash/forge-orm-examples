import React from "react"
import { bootDb, resetDb } from "./db"

type DbType = Awaited<ReturnType<typeof bootDb>>
type Cafe = {
  id: string
  name: string
  description: string
  tags: string[]
  location: { lng: number; lat: number }
  vibeEmbedding: number[]
  rating: number
  createdAt: Date
  _distanceMeters?: number
  _distance?: number
}

// Hand-authored 8-dim vibe vectors: dim 0 = quiet↔lively, 1 = cheap↔pricy,
// 2 = light↔dark, 3 = coffee↔tea, 4 = tourist↔local, 5 = slow↔fast,
// 6 = plain↔ornate, 7 = book↔work. The demo lets you tweak these
// sliders at query time to see cosine similarity re-rank the cafés.

const SEED: Omit<Cafe, "id" | "createdAt" | "_distanceMeters" | "_distance">[] = [
  {
    name: "Elephant House",
    description: "Where Rowling wrote the early Potter chapters. Warm, wooden, slow — the espresso is fine, the atmosphere is the point.",
    tags: ["quiet", "historic", "wifi"],
    location: { lng: -3.1901, lat: 55.9463 },
    vibeEmbedding: [0.1, 0.4, 0.7, 0.9, 0.2, 0.2, 0.6, 0.9],
    rating: 4.4,
  },
  {
    name: "Fabrique Bakery",
    description: "Swedish sourdough, cardamom buns the size of your fist. Louder than a library, quieter than a pub.",
    tags: ["bakery", "pastries", "wifi"],
    location: { lng: -0.0731, lat: 51.5232 },
    vibeEmbedding: [0.5, 0.3, 0.4, 0.6, 0.6, 0.6, 0.3, 0.4],
    rating: 4.6,
  },
  {
    name: "Prufrock Coffee",
    description: "Serious flat whites, deliberate pour-overs, the kind of place a barista wins prizes at.",
    tags: ["specialty", "espresso", "coffee"],
    location: { lng: -0.1085, lat: 51.5211 },
    vibeEmbedding: [0.4, 0.6, 0.5, 1.0, 0.3, 0.7, 0.4, 0.5],
    rating: 4.7,
  },
  {
    name: "Monmouth Coffee",
    description: "Wooden bench, no laptops, single-origin beans roasted a block away. Grab a bag and go.",
    tags: ["specialty", "coffee", "no-wifi"],
    location: { lng: -0.1274, lat: 51.5148 },
    vibeEmbedding: [0.7, 0.4, 0.3, 1.0, 0.5, 0.9, 0.2, 0.1],
    rating: 4.5,
  },
  {
    name: "TAP Coffee",
    description: "Bright, high-ceilinged, low-frills. Good filter, faster than you'd expect during the lunch rush.",
    tags: ["quick", "filter", "wifi"],
    location: { lng: -0.1345, lat: 51.5162 },
    vibeEmbedding: [0.6, 0.3, 0.1, 0.9, 0.4, 0.9, 0.2, 0.5],
    rating: 4.2,
  },
  {
    name: "Bar Termini",
    description: "Ornate, small, elbow-to-elbow. Italian espresso like the compass needle is stuck on 'right'.",
    tags: ["espresso", "aperitivo", "italian"],
    location: { lng: -0.1264, lat: 51.5133 },
    vibeEmbedding: [0.8, 0.8, 0.6, 1.0, 0.4, 0.6, 1.0, 0.1],
    rating: 4.6,
  },
  {
    name: "Kaffi Vínyl",
    description: "Vegan menu, DJ nights, cassette walls. Reykjavík's neighbourhood living room.",
    tags: ["vegan", "music", "night"],
    location: { lng: -21.9426, lat: 64.1471 },
    vibeEmbedding: [0.9, 0.4, 0.9, 0.2, 0.4, 0.4, 0.8, 0.2],
    rating: 4.5,
  },
  {
    name: "Cafe de Klos",
    description: "Ribs and stroopwafels next to a canal. Not really a coffee shop, but the coffee is fine and the mood is unbeatable.",
    tags: ["food", "canal", "tourist"],
    location: { lng: 4.8949, lat: 52.3629 },
    vibeEmbedding: [0.7, 0.5, 0.6, 0.4, 0.9, 0.4, 0.5, 0.3],
    rating: 4.3,
  },
]

// London City ≈ centre for the "near me" demo. Change this by clicking
// "Set me here" on any café — teaches the geo pipeline visually.
const DEFAULT_LOCATION = { lng: -0.1276, lat: 51.5074 }

export function App() {
  const [db, setDb] = React.useState<DbType | null>(null)
  const [bootError, setBootError] = React.useState<string | null>(null)
  const [cafes, setCafes] = React.useState<Cafe[]>([])
  const [tab, setTab] = React.useState<"all" | "near" | "search" | "vibe">("all")
  const [search, setSearch] = React.useState("")
  const [me, setMe] = React.useState(DEFAULT_LOCATION)
  const [radiusKm, setRadiusKm] = React.useState(5)
  const [vibe, setVibe] = React.useState<number[]>([0.2, 0.5, 0.5, 0.9, 0.3, 0.5, 0.4, 0.7])

  React.useEffect(() => {
    bootDb()
      .then(async (d) => {
        setDb(d)
        const count = await d.cafe.count({ where: {} })
        if (count === 0) {
          for (const c of SEED) await d.cafe.create({ data: c as any })
        }
      })
      .catch((e: Error) => setBootError(e?.message ?? String(e)))
  }, [])

  React.useEffect(() => { if (db) void reload() }, [db, tab, search, me.lng, me.lat, radiusKm, vibe])

  const reload = React.useCallback(async () => {
    if (!db) return
    if (tab === "all") {
      setCafes(await db.cafe.findMany({ orderBy: { createdAt: "desc" } }) as Cafe[])
    } else if (tab === "near") {
      // Two-stage geo: bbox cursor scan + Haversine post-filter + nearTo sort.
      // Adapter annotates each row with `_distanceMeters` when nearTo is used.
      const rows = await db.cafe.findMany({
        where:   { location: { near: { lng: me.lng, lat: me.lat, withinMeters: radiusKm * 1000 } } } as any,
        orderBy: { location: { direction: "asc", nearTo: { lng: me.lng, lat: me.lat } } } as any,
        take: 20,
      })
      setCafes(rows as Cafe[])
    } else if (tab === "search") {
      // Full-text via multiEntry token index; empty query falls back to list.
      const q = search.trim()
      if (!q) { setCafes(await db.cafe.findMany({ take: 20 }) as Cafe[]); return }
      setCafes(await db.cafe.findMany({ where: { description: { search: q } } as any, take: 20 }) as Cafe[])
    } else {
      // Vector: brute-force cosine over the 8-dim vibeEmbedding. `nearTo`
      // takes a bare number[] on vector fields (not a { vector } wrapper).
      const rows = await db.cafe.findMany({
        orderBy: { vibeEmbedding: { direction: "asc", nearTo: vibe } } as any,
        take: 10,
      })
      setCafes(rows as Cafe[])
    }
  }, [db, tab, search, me, radiusKm, vibe])

  const reseed = async () => {
    if (!db) return
    await resetDb()
    for (const c of SEED) await db.cafe.create({ data: c as any })
    reload()
  }

  if (bootError) return <ErrorScreen error={bootError} />
  if (!db)      return <p style={S.boot}>Opening IndexedDB…</p>

  return (
    <div style={S.page}>
      <header style={S.header}>
        <h1 style={S.h1}>forge-orm · IndexedDB</h1>
        <p style={S.sub}>Zero install. Full CRUD + geo + vector + FTS. Runs on the browser you're reading this in.</p>
      </header>

      <nav style={S.tabs}>
        {(["all", "near", "search", "vibe"] as const).map((t) => (
          <button key={t}
            onClick={() => setTab(t)}
            style={{ ...S.tab, ...(tab === t ? S.tabActive : {}) }}
          >
            {t === "all"    ? "All cafés"
            : t === "near"  ? "Near me (geo)"
            : t === "search"? "Full-text"
                            : "Vibe (vector)"}
          </button>
        ))}
      </nav>

      {tab === "near" && (
        <div style={S.controls}>
          <label style={S.controlLabel}>
            radius: <b>{radiusKm} km</b>
            <input type="range" min={1} max={2000} value={radiusKm} onChange={(e) => setRadiusKm(+e.target.value)} style={S.range} />
          </label>
          <span style={S.controlHint}>
            you: {me.lng.toFixed(3)}, {me.lat.toFixed(3)} — click a café to snap
          </span>
        </div>
      )}

      {tab === "search" && (
        <div style={S.controls}>
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="try 'espresso', 'wooden', 'vegan cassette'…" style={S.searchInput} />
        </div>
      )}

      {tab === "vibe" && (
        <div style={S.vibeGrid}>
          {(["quiet-lively","cheap-pricy","light-dark","coffee-tea","tourist-local","slow-fast","plain-ornate","book-work"] as const).map((label, i) => (
            <label key={label} style={S.vibeSlider}>
              <span style={S.vibeLabel}>{label}: <b>{vibe[i].toFixed(2)}</b></span>
              <input type="range" min={0} max={100} value={vibe[i] * 100}
                onChange={(e) => setVibe(vibe.map((v, j) => j === i ? +e.target.value / 100 : v))}
                style={S.range} />
            </label>
          ))}
        </div>
      )}

      <section style={S.list}>
        {cafes.length === 0 && <p style={S.empty}>Nothing here yet.</p>}
        {cafes.map((c) => (
          <article key={c.id} style={S.card}>
            <div style={S.cardHead}>
              <h3 style={S.cardName}>{c.name}</h3>
              <span style={S.cardMeta}>
                {typeof c._distanceMeters === "number"
                  ? `${(c._distanceMeters / 1000).toFixed(1)} km`
                  : typeof c._distance === "number"
                  ? `dist ${c._distance.toFixed(3)}`
                  : `★ ${c.rating.toFixed(1)}`}
              </span>
            </div>
            <p style={S.cardDesc}>{c.description}</p>
            <div style={S.tagRow}>
              {c.tags.map((t) => <span key={t} style={S.tag}>{t}</span>)}
              <button onClick={() => setMe({ lng: c.location.lng, lat: c.location.lat })} style={S.snapBtn}>
                set me here
              </button>
            </div>
          </article>
        ))}
      </section>

      <footer style={S.footer}>
        <button onClick={reseed} style={S.footerBtn}>Reset demo data</button>
        <span style={S.footerNote}>
          Data lives in IndexedDB · <code>forge-cafes</code> · refresh, it&rsquo;s still here.
        </span>
      </footer>
    </div>
  )
}

function ErrorScreen({ error }: { error: string }) {
  return (
    <div style={{ ...S.page, color: "#c00" }}>
      <h2>Couldn&rsquo;t open IndexedDB</h2>
      <pre style={{ background: "#fee", padding: 12, fontSize: 12, borderRadius: 8, overflow: "auto" }}>{error}</pre>
      <p style={{ fontSize: 13, color: "#666" }}>
        Private / incognito windows on Firefox and Safari sometimes disable IndexedDB entirely. Try a normal window.
      </p>
    </div>
  )
}

const S = {
  page:        { maxWidth: 720, margin: "40px auto", padding: "0 20px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif" } as const,
  boot:        { padding: 40, fontFamily: "system-ui" } as const,
  header:      { marginBottom: 24 } as const,
  h1:          { fontSize: 28, margin: 0, letterSpacing: -0.5 } as const,
  sub:         { color: "#666", marginTop: 4, fontSize: 14 } as const,
  tabs:        { display: "flex", gap: 4, borderBottom: "1px solid #e5e5e5", marginBottom: 20 } as const,
  tab:         { padding: "8px 14px", background: "none", border: "none", borderBottom: "2px solid transparent", cursor: "pointer", fontSize: 14, color: "#555" } as const,
  tabActive:   { borderBottomColor: "#111", color: "#111", fontWeight: 600 } as const,
  controls:    { display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 16, padding: "12px 14px", background: "#fafafa", borderRadius: 8 } as const,
  controlLabel:{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: "#333" } as const,
  controlHint: { fontSize: 12, color: "#888" } as const,
  range:       { width: 180 } as const,
  searchInput: { flex: 1, padding: "8px 12px", fontSize: 14, border: "1px solid #ddd", borderRadius: 6 } as const,
  vibeGrid:    { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 16, padding: 12, background: "#fafafa", borderRadius: 8 } as const,
  vibeSlider:  { display: "flex", flexDirection: "column", gap: 4, fontSize: 12 } as const,
  vibeLabel:   { color: "#555" } as const,
  list:        { display: "grid", gap: 12 } as const,
  empty:       { color: "#888", textAlign: "center", padding: 40 } as const,
  card:        { border: "1px solid #eee", borderRadius: 8, padding: 14 } as const,
  cardHead:    { display: "flex", justifyContent: "space-between", alignItems: "baseline" } as const,
  cardName:    { margin: 0, fontSize: 16 } as const,
  cardMeta:    { fontSize: 12, color: "#666", fontVariantNumeric: "tabular-nums" } as const,
  cardDesc:    { color: "#444", fontSize: 14, margin: "6px 0 10px" } as const,
  tagRow:      { display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" } as const,
  tag:         { fontSize: 11, background: "#f0f0f0", color: "#555", padding: "2px 8px", borderRadius: 4 } as const,
  snapBtn:     { marginLeft: "auto", fontSize: 11, background: "none", border: "1px solid #ddd", padding: "2px 8px", borderRadius: 4, cursor: "pointer", color: "#666" } as const,
  footer:      { marginTop: 32, paddingTop: 20, borderTop: "1px solid #eee", display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" } as const,
  footerBtn:   { padding: "6px 12px", fontSize: 12, background: "#fff", border: "1px solid #ddd", borderRadius: 4, cursor: "pointer" } as const,
  footerNote:  { fontSize: 11, color: "#888" } as const,
}

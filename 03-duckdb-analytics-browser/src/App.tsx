import React from "react"
import { createDb, f, model } from "forge-orm"

// DuckDB excels at OLAP — columnar reads, aggregations, ad-hoc analytics.
// Browser via @duckdb/duckdb-wasm; the same code works server-side
// with the native `duckdb` driver — change one URL.

const Sale = model("sales", {
  id:       f.id({ type: "uuid" }),
  product:  f.string(),
  qty:      f.int(),
  price:    f.float(),
  city:     f.string(),
  soldAt:   f.dateTime(),
})

export function App() {
  const [results, setResults] = React.useState<Array<{ product: string; units: number }>>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    (async () => {
      const db = await createDb({ url: "duckdb::memory:", schema: { sale: Sale } })
      await db.$migrate()

      const products = ["Coffee", "Donut", "Sandwich", "Smoothie", "Bagel"]
      const cities = ["Lagos", "Abuja", "Accra", "Nairobi"]
      const data = Array.from({ length: 5000 }, (_, i) => ({
        product: products[i % products.length]!,
        qty:     1 + Math.floor(Math.random() * 5),
        price:   2 + Math.random() * 8,
        city:    cities[i % cities.length]!,
        soldAt:  new Date(Date.now() - Math.random() * 30 * 86_400_000),
      }))
      await db.sale.createMany({ data })

      // Group by product, sum qty.
      const top = await db.sale.groupBy({
        by: ["product"],
        _sum: { qty: true },
        orderBy: { _sum: { qty: "desc" } },
        take: 5,
      })
      setResults(top.map((r) => ({ product: r.product, units: r._sum.qty ?? 0 })))
      setLoading(false)
    })()
  }, [])

  if (loading) return <p style={{ padding: 40 }}>Crunching 5,000 sales rows in your browser…</p>

  return (
    <div style={{ maxWidth: 480, margin: "40px auto", fontFamily: "system-ui" }}>
      <h1>Top products by units sold</h1>
      <ul>
        {results.map((r) => (
          <li key={r.product}>{r.product} — {r.units} units</li>
        ))}
      </ul>
      <p style={{ color: "#666", fontSize: 12, marginTop: 20 }}>
        DuckDB-wasm executed the aggregation in the tab — no server, no network.
      </p>
    </div>
  )
}

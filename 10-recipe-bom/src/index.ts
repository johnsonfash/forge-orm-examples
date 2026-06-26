// Recursive BOM — a recipe whose components can themselves be recipes
// (sub-recipes). Pattern works for food (sourdough → starter), cosmetics
// (lotion → base + fragrance), manufacturing (assembly → sub-assembly),
// auto repair (job → parts + sub-jobs).

import { createDb, f, rel } from "forge-orm"

const Recipe = f.model({
  id:        f.string().id().default("uuid"),
  parentSku: f.string().unique(),
  name:      f.string(),
  yieldQty:  f.float().default(1),
  yieldUnit: f.string().default("ea"),
}).relate(() => ({
  lines: rel.many("recipeLine", { on: "recipeId", refs: "id" }),
}))

const RecipeLine = f.model({
  id:           f.string().id().default("uuid"),
  recipeId:     f.string(),
  componentSku: f.string(), // either a raw SKU or another Recipe.parentSku
  qty:          f.float(),
  unit:         f.string().default("g"),
  wastage:      f.float().default(0), // 0..1, fraction lost during production
}).relate(() => ({
  recipe: rel.one("recipe", { on: "recipeId", refs: "id" }),
}))

const db = await createDb({
  url: "file:./bom.db",
  schema: { recipe: Recipe, recipeLine: RecipeLine },
})
await db.$migrate()

// Seed: sourdough loaf needs starter (which is also a recipe).
const starter = await db.recipe.upsert({
  where:  { parentSku: "REC-STARTER" },
  create: { parentSku: "REC-STARTER", name: "Sourdough starter", yieldQty: 200, yieldUnit: "g" },
  update: {},
})
await db.recipeLine.upsert({
  where: { id: "L-STARTER-FLOUR" },
  create: { id: "L-STARTER-FLOUR", recipeId: starter.id, componentSku: "ING-FLOUR", qty: 100, unit: "g" },
  update: {},
})
await db.recipeLine.upsert({
  where: { id: "L-STARTER-WATER" },
  create: { id: "L-STARTER-WATER", recipeId: starter.id, componentSku: "ING-WATER", qty: 100, unit: "g" },
  update: {},
})

const loaf = await db.recipe.upsert({
  where:  { parentSku: "REC-LOAF" },
  create: { parentSku: "REC-LOAF", name: "Country loaf", yieldQty: 800, yieldUnit: "g" },
  update: {},
})
await db.recipeLine.upsert({
  where: { id: "L-LOAF-STARTER" },
  create: { id: "L-LOAF-STARTER", recipeId: loaf.id, componentSku: "REC-STARTER", qty: 200, unit: "g" },
  update: {},
})
await db.recipeLine.upsert({
  where: { id: "L-LOAF-FLOUR" },
  create: { id: "L-LOAF-FLOUR", recipeId: loaf.id, componentSku: "ING-FLOUR", qty: 500, unit: "g", wastage: 0.05 },
  update: {},
})
await db.recipeLine.upsert({
  where: { id: "L-LOAF-WATER" },
  create: { id: "L-LOAF-WATER", recipeId: loaf.id, componentSku: "ING-WATER", qty: 350, unit: "g" },
  update: {},
})

// Recursive cost rollup — sub-recipes expand into their own components.
const prices = new Map<string, number>([
  ["ING-FLOUR", 0.002], // $0.002/g
  ["ING-WATER", 0.0001],
  ["ING-SALT",  0.005],
])

async function rollup(parentSku: string, seen = new Set<string>()): Promise<number> {
  if (seen.has(parentSku)) return 0 // cycle guard
  seen.add(parentSku)
  const recipe = await db.recipe.findUnique({
    where:   { parentSku },
    include: { lines: true },
  })
  if (!recipe) return prices.get(parentSku) ?? 0
  let cost = 0
  for (const l of recipe.lines) {
    const unitCost = await rollup(l.componentSku, seen)
    cost += unitCost * l.qty * (1 + l.wastage)
  }
  return cost / recipe.yieldQty // cost per yieldUnit
}

console.log("Per-gram cost of REC-LOAF:", (await rollup("REC-LOAF")).toFixed(5))

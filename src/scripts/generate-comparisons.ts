import { PrismaClient } from "../generated/prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || "",
  authToken: process.env.TURSO_AUTH_TOKEN,
})
const prisma = new PrismaClient({ adapter })

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

function parseSpecs(str: string): Record<string, string> {
  try { const p = JSON.parse(str); return typeof p === "object" && p !== null ? p : {} } catch { return {} }
}
function parseArr(str: string): string[] {
  try { const p = JSON.parse(str); return Array.isArray(p) ? p : [] } catch { return [] }
}

interface ProductData {
  id: string
  name: string
  slug: string
  image: string
  description: string
  price: string
  rating: number | null
  categoryId: string
  categoryName: string
  specs: Record<string, string>
  pros: string[]
  cons: string[]
  sourceUrl: string | null
}

function parseProduct(row: any): ProductData {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    image: row.image,
    description: row.description,
    price: row.price,
    rating: row.rating,
    categoryId: row.categoryId,
    categoryName: row.category?.name ?? row.categoryId,
    specs: parseSpecs(row.specs),
    pros: parseArr(row.pros),
    cons: parseArr(row.cons),
    sourceUrl: row.sourceUrl,
  }
}

function isNewer(a: ProductData, b: ProductData): number {
  const aSpecs = a.specs
  const bSpecs = b.specs
  let aScore = 0
  let bScore = 0

  const aRAM = parseInt(aSpecs["RAM"] || "0")
  const bRAM = parseInt(bSpecs["RAM"] || "0")
  if (aRAM > bRAM) aScore++
  else if (bRAM > aRAM) bScore++

  const aBat = parseInt(aSpecs["Battery"] || "0")
  const bBat = parseInt(bSpecs["Battery"] || "0")
  if (aBat > bBat) aScore++
  else if (bBat > aBat) bScore++

  const aPrice = parseFloat(a.price.replace(/[^0-9.]/g, ""))
  const bPrice = parseFloat(b.price.replace(/[^0-9.]/g, ""))

  if (aSpecs["Chipset"] && !bSpecs["Chipset"]) aScore += 2
  else if (!aSpecs["Chipset"] && bSpecs["Chipset"]) bScore += 2

  if (aSpecs["Display"]?.includes("OLED") && !bSpecs["Display"]?.includes("OLED")) aScore++
  else if (!aSpecs["Display"]?.includes("OLED") && bSpecs["Display"]?.includes("OLED")) bScore++

  if (aSpecs["NFC"] === "Yes" && bSpecs["NFC"] !== "Yes") aScore++
  else if (aSpecs["NFC"] !== "Yes" && bSpecs["NFC"] === "Yes") bScore++

  if (a.price && !b.price) aScore++
  else if (!a.price && b.price) bScore++

  const aPros = a.pros.length
  const bPros = b.pros.length
  if (aPros > bPros) aScore++
  else if (bPros > aPros) bScore++

  return aScore === bScore ? 0 : aScore > bScore ? 0 : 1
}

function pickHighlight(a: ProductData, b: ProductData): string {
  const points: string[] = []

  if (a.price || b.price) {
    const aP = parseFloat(a.price.replace(/[^0-9.]/g, ""))
    const bP = parseFloat(b.price.replace(/[^0-9.]/g, ""))
    if (aP && bP) {
      if (aP > bP) points.push(`${a.name} is priced higher at ${a.price}`)
      else points.push(`${b.name} is priced higher at ${b.price}`)
    }
  }

  const aChip = a.specs["Chipset"]
  const bChip = b.specs["Chipset"]
  if (aChip && bChip && aChip !== bChip) {
    points.push(`${a.name} runs on ${aChip} while ${b.name} uses ${bChip}`)
  }

  const aRAM = a.specs["RAM"]
  const bRAM = b.specs["RAM"]
  if (aRAM && bRAM && aRAM !== bRAM) {
    points.push(`${a.name} offers ${aRAM} RAM vs ${bRAM} on ${b.name}`)
  }

  const aDis = a.specs["Display"]
  const bDis = b.specs["Display"]
  if (aDis && bDis && aDis !== bDis) {
    if (aDis.includes("120Hz") && !bDis.includes("120Hz")) points.push(`${a.name} has a high-refresh display`)
    else if (bDis.includes("120Hz") && !aDis.includes("120Hz")) points.push(`${b.name} has a high-refresh display`)
  }

  if (points.length === 0) {
    points.push(`Both ${a.name} and ${b.name} are ${a.categoryName} devices designed for different users`)
  }

  return points.join(". ")
}

function generateDescription(a: ProductData, b: ProductData): string {
  const sameCat = a.categoryName === b.categoryName
  return `Compare ${a.name} vs ${b.name} — ${sameCat ? `two ${a.categoryName} devices` : `a ${a.categoryName} vs ${b.categoryName} face-off`}. ${pickHighlight(a, b)}.`
}

function generateSummary(a: ProductData, b: ProductData): string {
  const sameCat = a.categoryName === b.categoryName
  let s = `${a.name} and ${b.name} are ${sameCat ? `${a.categoryName} products` : `from different categories — ${a.categoryName} vs ${b.categoryName}`}. `

  const aSpecs = Object.keys(a.specs).length
  const bSpecs = Object.keys(b.specs).length
  s += `${a.name} has ${aSpecs} documented specs, ${b.name} has ${bSpecs}. `

  if (a.pros.length > 0 || b.pros.length > 0) {
    s += `${a.name} highlights include ${a.pros.slice(0, 2).join(", ") || "N/A"}. `
    s += `${b.name} highlights include ${b.pros.slice(0, 2).join(", ") || "N/A"}. `
  }

  s += pickHighlight(a, b)
  return s
}

function generateVerdict(a: ProductData, b: ProductData, winner: number): string {
  const winnerName = winner === 0 ? a.name : b.name
  const loserName = winner === 0 ? b.name : a.name
  return `${winnerName} edges out ${loserName} based on specs and feature comparison. It offers a better balance of performance, display quality, and value for most users.`
}

async function main() {
  console.log("Fetching products...")
  const rows = await prisma.product.findMany({ include: { category: true } })
  console.log(`Found ${rows.length} products`)

  const products = rows.map(parseProduct)

  const categories = [...new Set(products.map((p) => p.categoryId))]
  console.log(`Found ${categories.length} categories`)

  // Global existing pairs lookup
  const allGlobalComparisons = await prisma.comparison.findMany({
    select: { slug: true, productAId: true, productBId: true },
  })
  const allGlobalPairs = new Set(allGlobalComparisons.map((c) => [c.productAId, c.productBId].sort().join("-")))
  const allGlobalSlugs = new Set(allGlobalComparisons.map((c) => c.slug))

  let totalCreated = 0

  for (const catId of categories) {
    const catProducts = products.filter((p) => p.categoryId === catId)
    const catName = catProducts[0]?.categoryName || catId

    if (catProducts.length < 2) {
      console.log(`  ${catName}: only ${catProducts.length} product(s), skipping`)
      continue
    }

    // Get existing comparison slugs to avoid duplicates
    const existingComparisons = await prisma.comparison.findMany({
      where: { categoryId: catId },
      select: { slug: true, productAId: true, productBId: true },
    })
    const existingSlugs = new Set(existingComparisons.map((c) => c.slug))
    const existingPairs = new Set(existingComparisons.map((c) => [c.productAId, c.productBId].sort().join("-")))

    // Sort by newest first (lower price = newer for this purpose, or by rating)
    catProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0))

    let created = 0

    for (let i = 0; i < catProducts.length; i++) {
      for (let j = i + 1; j < catProducts.length; j++) {
        const a = catProducts[i]
        const b = catProducts[j]
        const pairKey = [a.id, b.id].sort().join("-")

        if (existingPairs.has(pairKey)) continue

        const slug = slugify(`${a.name} vs ${b.name} from ${catName}`)
        if (!slug || existingSlugs.has(slug)) continue

        const winnerIndex = isNewer(a, b)

        const prosA = a.pros.slice(0, 4)
        const consA = a.cons.slice(0, 4)
        const prosB = b.pros.slice(0, 4)
        const consB = b.cons.slice(0, 4)

        const comparison = {
          id: pairKey,
          slug,
          title: `${a.name} vs ${b.name}`,
          description: generateDescription(a, b),
          categoryId: catId,
          productAId: a.id,
          productBId: b.id,
          summary: generateSummary(a, b),
          verdict: generateVerdict(a, b, winnerIndex),
          winnerIndex,
          prosPerProductA: JSON.stringify(prosA),
          consPerProductA: JSON.stringify(consA),
          prosPerProductB: JSON.stringify(prosB),
          consPerProductB: JSON.stringify(consB),
        }

        try {
          await prisma.comparison.create({ data: comparison })
          existingSlugs.add(slug)
          existingPairs.add(pairKey)
          created++
          totalCreated++
          console.log(`  Created: ${a.name} vs ${b.name}`)
        } catch (err) {
          console.error(`  Error creating ${a.name} vs ${b.name}: ${err}`)
        }
      }
    }

    console.log(`  ${catName}: ${created} comparisons created`)
  }

  // ── Cross-category comparisons ──
  console.log("\n--- Cross-category comparisons ---")
  const brandCategories = categories.filter((id) => {
    const p = products.find((x) => x.categoryId === id)
    return p && !["tech", "budget"].includes(p.categoryName.toLowerCase())
  })

  let crossCreated = 0
  for (let i = 0; i < brandCategories.length; i++) {
    for (let j = i + 1; j < brandCategories.length; j++) {
      const catAProducts = products.filter((p) => p.categoryId === brandCategories[i])
      const catBProducts = products.filter((p) => p.categoryId === brandCategories[j])
      const catAName = catAProducts[0]?.categoryName || ""
      const catBName = catBProducts[0]?.categoryName || ""

      for (const a of catAProducts.slice(0, 6)) {
        for (const b of catBProducts.slice(0, 6)) {
          const pairKey = [a.id, b.id].sort().join("-")
          if (allGlobalPairs.has(pairKey)) continue

          const aPrice = parseFloat(a.price.replace(/[^0-9.]/g, ""))
          const bPrice = parseFloat(b.price.replace(/[^0-9.]/g, ""))
          if (aPrice && bPrice) {
            const ratio = Math.max(aPrice, bPrice) / Math.min(aPrice, bPrice)
            if (ratio > 2.5) continue
          }

          const slug = slugify(`${a.name} vs ${b.name} ${catAName} ${catBName}`)
          if (!slug || allGlobalSlugs.has(slug)) continue

          allGlobalSlugs.add(slug)
          allGlobalPairs.add(pairKey)

          const winnerIndex = isNewer(a, b)
          const comparison = {
            id: pairKey,
            slug,
            title: `${a.name} vs ${b.name}`,
            description: generateDescription(a, b),
            categoryId: a.categoryId,
            productAId: a.id,
            productBId: b.id,
            summary: generateSummary(a, b),
            verdict: generateVerdict(a, b, winnerIndex),
            winnerIndex,
            prosPerProductA: JSON.stringify(a.pros.slice(0, 4)),
            consPerProductA: JSON.stringify(a.cons.slice(0, 4)),
            prosPerProductB: JSON.stringify(b.pros.slice(0, 4)),
            consPerProductB: JSON.stringify(b.cons.slice(0, 4)),
          }

          try {
            await prisma.comparison.create({ data: comparison })
            crossCreated++
            totalCreated++
            console.log(`  Cross: ${a.name} vs ${b.name}`)
          } catch {}
        }
      }
    }
  }
  console.log(`Cross-category comparisons created: ${crossCreated}`)

  console.log(`\nDone! Total comparisons created: ${totalCreated}`)
  await prisma.$disconnect()
}

main().catch((err) => {
  console.error("Fatal error:", err)
  process.exit(1)
})

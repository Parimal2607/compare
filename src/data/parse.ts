import type { Product, Comparison } from "./types"

interface RawProductRow {
  id: string
  name: string
  slug: string
  image: string
  heroImage: string | null
  description: string
  price: string
  rating: number | null
  categoryId: string
  category?: { name: string } | null
  specs: string
  pros: string
  cons: string
  affiliateLink: string | null
}

interface RawComparisonRow {
  id: string
  title: string
  slug: string
  description: string
  categoryId: string
  category?: { name: string } | null
  productAId: string
  productBId: string
  summary: string
  verdict: string
  winnerIndex: number
  prosPerProductA: string
  consPerProductA: string
  prosPerProductB: string
  consPerProductB: string
  heroImage: string | null
}

function parseSpecs(str: string): Record<string, string> {
  try {
    const parsed = JSON.parse(str)
    if (Array.isArray(parsed)) {
      return Object.fromEntries(parsed.filter(([k]: [string, string]) => k?.trim()))
    }
    if (typeof parsed === "object" && parsed !== null) return parsed
    return {}
  } catch {
    return {}
  }
}

function safeJsonParse<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str)
  } catch {
    return fallback
  }
}

export function parseProduct(row: RawProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    image: row.image,
    heroImage: row.heroImage ?? undefined,
    description: row.description,
    price: row.price,
    rating: row.rating,
    category: row.category?.name ?? row.categoryId,
    categoryId: row.categoryId,
    specs: parseSpecs(row.specs),
    pros: safeJsonParse(row.pros, []),
    cons: safeJsonParse(row.cons, []),
    affiliateLink: row.affiliateLink ?? undefined,
  }
}

export function parseComparison(row: RawComparisonRow): Comparison {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    category: row.category?.name ?? row.categoryId,
    categoryId: row.categoryId,
    productAId: row.productAId,
    productBId: row.productBId,
    summary: row.summary,
    verdict: row.verdict,
    winnerIndex: row.winnerIndex as 0 | 1,
    prosPerProduct: [safeJsonParse(row.prosPerProductA, []), safeJsonParse(row.prosPerProductB, [])] as [string[], string[]],
    consPerProduct: [safeJsonParse(row.consPerProductA, []), safeJsonParse(row.consPerProductB, [])] as [string[], string[]],
    heroImage: row.heroImage ?? undefined,
  }
}

export function parseProducts(
  rows: RawProductRow[],
  existingMap?: Map<string, Product>
): Map<string, Product> {
  const map = existingMap ?? new Map()
  for (const row of rows) {
    if (!map.has(row.id)) {
      map.set(row.id, parseProduct(row))
    }
  }
  return map
}

export function buildProductMap(
  comparisons: Comparison[],
  products: Product[]
): Map<string, { productA: Product | null; productB: Product | null }> {
  const map = new Map(products.map((p) => [p.id, p]))
  const result = new Map<string, { productA: Product | null; productB: Product | null }>()
  for (const c of comparisons) {
    result.set(c.id, {
      productA: map.get(c.productAId) ?? null,
      productB: map.get(c.productBId) ?? null,
    })
  }
  return result
}
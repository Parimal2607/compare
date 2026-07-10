import { prisma } from "@/lib/prisma"
import { parseComparison, parseProduct } from "./parse"
import type { Comparison, Product } from "./types"

export type CategoryComparisons = {
  category: { id: string; name: string; slug: string }
  comparisons: Comparison[]
  productMap: Map<string, { productA: Product | null; productB: Product | null }>
}

export async function getCategoryComparisonsMap(take = 4): Promise<CategoryComparisons[]> {
  const categories = await prisma.category.findMany()
  const allComparisons = await prisma.comparison.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  })

  const grouped = new Map<string, typeof allComparisons>()
  for (const comp of allComparisons) {
    const catId = comp.categoryId
    if (!grouped.has(catId)) grouped.set(catId, [])
    const arr = grouped.get(catId)!
    if (arr.length < take) arr.push(comp)
  }

  const allProductIds = [
    ...new Set([...grouped.values()].flatMap((comps) => comps.flatMap((c) => [c.productAId, c.productBId]))),
  ]
  const products = await prisma.product.findMany({
    where: { id: { in: allProductIds } },
    include: { category: true },
  })
  const productMap = new Map(products.map((p) => [p.id, parseProduct(p)]))

  const result: CategoryComparisons[] = []
  for (const cat of categories) {
    const catComparisons = grouped.get(cat.id)
    if (!catComparisons || catComparisons.length === 0) continue

    const cmpMap = new Map<string, { productA: Product | null; productB: Product | null }>()
    for (const c of catComparisons) {
      cmpMap.set(c.id, {
        productA: productMap.get(c.productAId) ?? null,
        productB: productMap.get(c.productBId) ?? null,
      })
    }

    result.push({
      category: { id: cat.id, name: cat.name, slug: cat.slug },
      comparisons: catComparisons.map(parseComparison),
      productMap: cmpMap,
    })
  }
  return result
}

export async function getComparisons(opts?: { skip?: number; take?: number }): Promise<Comparison[]> {
  const rows = await prisma.comparison.findMany({
    skip: opts?.skip,
    take: opts?.take,
    include: { category: true },
  })
  return rows.map(parseComparison)
}

export async function getComparisonCount(): Promise<number> {
  return prisma.comparison.count()
}

export async function getLatestComparisonPerCategory() {
  const categories = await prisma.category.findMany()
  const results = await Promise.all(
    categories.map((cat) =>
      prisma.comparison.findFirst({
        where: { categoryId: cat.id },
        include: { category: true },
        orderBy: { createdAt: "desc" },
      })
    ),
  )
  const comparisons = results.filter((c): c is NonNullable<typeof c> => c !== null)

  const productIds = [...new Set(comparisons.flatMap((r) => [r.productAId, r.productBId]))]
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: { category: true },
  })
  const productMap = new Map(products.map((p) => [p.id, parseProduct(p)]))
  return comparisons.map((row) => ({
    comparison: parseComparison(row),
    productA: productMap.get(row.productAId) ?? null,
    productB: productMap.get(row.productBId) ?? null,
  }))
}

export async function getComparisonsWithProducts(take = 3) {
  const rows = await prisma.comparison.findMany({
    take,
    orderBy: { createdAt: "desc" },
    include: { category: true },
  })
  const productIds = [...new Set(rows.flatMap((r) => [r.productAId, r.productBId]))]
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: { category: true },
  })
  const productMap = new Map(products.map((p) => [p.id, parseProduct(p)]))
  return rows.map((row) => ({
    comparison: parseComparison(row),
    productA: productMap.get(row.productAId) ?? null,
    productB: productMap.get(row.productBId) ?? null,
  }))
}

export async function getComparisonsWithProductMap(comparisons: Comparison[]) {
  const productIds = [...new Set(comparisons.flatMap((c) => [c.productAId, c.productBId]))]
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: { category: true },
  })
  const productMap = new Map(products.map((p) => [p.id, parseProduct(p)]))
  const result = new Map<string, { productA: Product | null; productB: Product | null }>()
  for (const c of comparisons) {
    result.set(c.id, {
      productA: productMap.get(c.productAId) ?? null,
      productB: productMap.get(c.productBId) ?? null,
    })
  }
  return result
}

export async function getComparisonBySlug(slug: string): Promise<Comparison | null> {
  const row = await prisma.comparison.findUnique({
    where: { slug },
    include: { category: true },
  })
  return row ? parseComparison(row) : null
}

export async function getComparisonBySlugWithProducts(slug: string) {
  const comparison = await getComparisonBySlug(slug)
  if (!comparison) return null

  const [productARow, productBRow] = await Promise.all([
    prisma.product.findUnique({ where: { id: comparison.productAId }, include: { category: true } }),
    prisma.product.findUnique({ where: { id: comparison.productBId }, include: { category: true } }),
  ])

  return {
    comparison,
    productA: productARow ? parseProduct(productARow) : null,
    productB: productBRow ? parseProduct(productBRow) : null,
  }
}

export async function getComparisonsByCategory(categoryId: string): Promise<Comparison[]> {
  const rows = await prisma.comparison.findMany({
    where: { categoryId },
    include: { category: true },
  })
  return rows.map(parseComparison)
}

export async function getComparisonsByCategoryName(categoryName: string): Promise<Comparison[]> {
  const rows = await prisma.comparison.findMany({
    where: { category: { name: categoryName } },
    include: { category: true },
  })
  return rows.map(parseComparison)
}

export async function getAllComparisonCategoryNames(): Promise<string[]> {
  const rows = await prisma.comparison.findMany({
    select: { category: { select: { name: true } } },
    distinct: ["categoryId"],
  })
  return [...new Set(rows.map((r) => r.category.name))]
}

export async function getComparionsByProductId(productId: string): Promise<Comparison[]> {
  const rows = await prisma.comparison.findMany({
    where: {
      OR: [{ productAId: productId }, { productBId: productId }],
    },
    include: { category: true },
  })
  return rows.map(parseComparison)
}

export type GroupedComparisons = {
  categoryId: string
  categoryName: string
  categorySlug: string
  comparisons: Comparison[]
  productData: Record<string, { productA: Product | null; productB: Product | null }>
}[]

export async function getAllComparisonsGroupedByCategory(): Promise<GroupedComparisons> {
  const categories = await prisma.category.findMany()
  const comparisons = await prisma.comparison.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  })

  const allProductIds = [...new Set(comparisons.flatMap((c) => [c.productAId, c.productBId]))]
  const productRows = allProductIds.length > 0
    ? await prisma.product.findMany({
        where: { id: { in: allProductIds } },
        include: { category: true },
      })
    : []
  const productMap = new Map(productRows.map((p) => [p.id, parseProduct(p)]))

  const grouped = new Map<string, Comparison[]>()
  for (const comp of comparisons) {
    const catId = comp.categoryId
    if (!grouped.has(catId)) grouped.set(catId, [])
    grouped.get(catId)!.push(parseComparison(comp))
  }

  const result: GroupedComparisons = []
  for (const cat of categories) {
    const catComparisons = grouped.get(cat.id)
    if (!catComparisons || catComparisons.length === 0) continue

    const productData: Record<string, { productA: Product | null; productB: Product | null }> = {}
    for (const c of catComparisons) {
      productData[c.id] = {
        productA: productMap.get(c.productAId) ?? null,
        productB: productMap.get(c.productBId) ?? null,
      }
    }

    result.push({
      categoryId: cat.id,
      categoryName: cat.name,
      categorySlug: cat.slug,
      comparisons: catComparisons,
      productData,
    })
  }

  return result
}
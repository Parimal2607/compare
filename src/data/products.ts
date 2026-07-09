import { prisma } from "@/lib/prisma"
import { parseProduct, parseProducts } from "./parse"
import type { Product, Category } from "./types"

export async function getProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({ include: { category: true } })
  return rows.map(parseProduct)
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const row = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  })
  return row ? parseProduct(row) : null
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { categoryId },
    include: { category: true },
  })
  return rows.map(parseProduct)
}

export async function getProductsByCategoryName(categoryName: string): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { category: { name: categoryName } },
    include: { category: true },
  })
  return rows.map(parseProduct)
}

export async function getProductsByIds(ids: string[]): Promise<Map<string, Product>> {
  const rows = await prisma.product.findMany({
    where: { id: { in: ids } },
    include: { category: true },
  })
  return parseProducts(rows)
}

export async function getCategories(): Promise<Category[]> {
  const rows = await prisma.category.findMany()
  return rows.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))
}

export async function getCategoryNames(): Promise<string[]> {
  const rows = await prisma.category.findMany()
  return rows.map((c) => c.name)
}

export async function getProductCount(): Promise<number> {
  return prisma.product.count()
}
import { PrismaClient } from "../generated/prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"

const CATEGORIES_TO_DELETE = ["tech", "Flagship", "Mid-range", "Budget", "Foldable"]

async function main() {
  const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL || "", authToken: process.env.TURSO_AUTH_TOKEN })
  const prisma = new PrismaClient({ adapter })

  // Collect all product IDs in old categories
  const productIds: string[] = []
  const catNames: string[] = []
  for (const catId of CATEGORIES_TO_DELETE) {
    const cat = await prisma.category.findUnique({ where: { id: catId } })
    if (!cat) { console.log(`${catId}: not found`); continue }
    catNames.push(cat.name)
    const prods = await prisma.product.findMany({ where: { categoryId: catId }, select: { id: true } })
    productIds.push(...prods.map(p => p.id))
  }

  console.log(`Found ${productIds.length} products across old categories`)

  // Delete ALL comparisons referencing these products (regardless of category)
  const compDel = await prisma.comparison.deleteMany({
    where: { OR: [{ productAId: { in: productIds } }, { productBId: { in: productIds } }] }
  })
  console.log(`Deleted ${compDel.count} comparisons referencing old products`)

  // Delete any remaining comparisons in old categories
  let compCatDel = 0
  for (const catId of CATEGORIES_TO_DELETE) {
    const r = await prisma.comparison.deleteMany({ where: { categoryId: catId } })
    compCatDel += r.count
  }
  if (compCatDel > 0) console.log(`Deleted ${compCatDel} comparisons in old categories`)

  // Delete products
  const prodDel = await prisma.product.deleteMany({
    where: { categoryId: { in: CATEGORIES_TO_DELETE } }
  })
  console.log(`Deleted ${prodDel.count} products`)

  // Delete categories
  for (const catId of CATEGORIES_TO_DELETE) {
    const cat = await prisma.category.findUnique({ where: { id: catId } })
    if (!cat) continue
    await prisma.category.delete({ where: { id: catId } })
    console.log(`Deleted category: ${cat.name}`)
  }

  await prisma.$disconnect()
  console.log("Done!")
}
main().catch(console.error)

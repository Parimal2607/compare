import * as dotenv from "dotenv"
import * as path from "path"
import * as fs from "fs"
dotenv.config()

import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"

const dbPath = path.resolve(process.cwd(), "prisma/dev.db")
const dbUrl = `file:///${dbPath.replace(/\\/g, "/")}`

const adapter = new PrismaLibSql({ url: dbUrl })
const prisma = new PrismaClient({ adapter })

async function main() {
  const jsonArg = process.argv[2]
  if (!jsonArg) {
    console.error("Usage: npx tsx prisma/import-json.ts <path-to-json>")
    process.exit(1)
  }

  const jsonPath = path.resolve(process.cwd(), jsonArg)
  const raw = fs.readFileSync(jsonPath, "utf-8")
  const data = JSON.parse(raw)

  const { categories, products, comparisons } = data

  if (!categories || !products || !comparisons) {
    console.error("JSON must contain 'categories', 'products', and 'comparisons' arrays")
    process.exit(1)
  }

  console.log(`Seeding ${categories.length} categories...`)
  for (const cat of categories) {
    await prisma.category.upsert({ where: { id: cat.id }, update: cat, create: cat })
  }

  console.log(`Seeding ${products.length} products...`)
  for (const product of products) {
    await prisma.product.upsert({ where: { id: product.id }, update: product, create: product })
  }

  console.log(`Seeding ${comparisons.length} comparisons...`)
  for (const comp of comparisons) {
    await prisma.comparison.upsert({ where: { id: comp.id }, update: comp, create: comp })
  }

  console.log("Import complete!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

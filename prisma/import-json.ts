import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"
import dotenv from "dotenv"
import * as fs from "fs"
dotenv.config({ path: ".env" })

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
})
const prisma = new PrismaClient({ adapter })

interface ProductJson {
  name: string
  slug: string
  status: string
  image: string | null
  heroImage: string | null
  description: string
  price: string
  rating: number | null
  categoryId: string
  specs: Record<string, string>
  pros: string[]
  cons: string[]
  affiliateLink?: string
  imageNote?: string
}

async function main() {
  // Ensure status column exists (safe to run even if already present)
  try {
    await prisma.$executeRawUnsafe("ALTER TABLE Product ADD COLUMN status TEXT DEFAULT 'available'")
    console.log("Added status column")
  } catch {
    console.log("Status column already exists")
  }

  const raw = fs.readFileSync(process.argv[2] || "C:\\Users\\parimal\\Downloads\\smartphones-full.json", "utf-8")
  const products: ProductJson[] = JSON.parse(raw)
  console.log(`Total products in JSON: ${products.length}`)

  // Find category by slug "tech"
  const cat = await prisma.category.findUnique({ where: { slug: "tech" } })
  if (!cat) {
    console.error("Category 'tech' not found!")
    process.exit(1)
  }
  const categoryId = cat.id
  console.log(`Using category: ${cat.name} (${cat.id})`)

  // Get existing product slugs
  const existing = await prisma.product.findMany({ select: { slug: true } })
  const existingSlugs = new Set(existing.map(p => p.slug))
  console.log(`Existing products in DB: ${existingSlugs.size}`)

  let imported = 0
  let skipped = 0

  for (const p of products) {
    if (existingSlugs.has(p.slug)) {
      console.log(`  SKIP: ${p.name} (${p.slug})`)
      skipped++
      continue
    }

    await prisma.product.create({
      data: {
        id: p.slug,
        name: p.name,
        slug: p.slug,
        image: p.image || "",
        heroImage: p.heroImage || null,
        description: p.description,
        price: p.price,
        rating: p.rating ?? 0,
        status: p.status || "available",
        categoryId,
        specs: JSON.stringify(p.specs),
        pros: JSON.stringify(p.pros),
        cons: JSON.stringify(p.cons),
        affiliateLink: p.affiliateLink || null,
      },
    })
    console.log(`  IMPORT: ${p.name} (${p.slug}) [${p.status}]`)
    imported++
  }

  console.log(`\nDone: ${imported} imported, ${skipped} skipped`)
}

main().catch(e => {
  console.error(e)
  process.exit(1)
}).finally(() => prisma.$disconnect())

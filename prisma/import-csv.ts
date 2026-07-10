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

function parseCSV(text: string): string[][] {
  const rows: string[][] = []
  let current: string[] = []
  let field = ""
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    const next = text[i + 1]
    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"'
        i++
      } else if (ch === '"') {
        inQuotes = false
      } else {
        field += ch
      }
    } else {
      if (ch === '"') {
        inQuotes = true
      } else if (ch === ",") {
        current.push(field)
        field = ""
      } else if (ch === "\r") {
        // skip
      } else if (ch === "\n") {
        current.push(field)
        field = ""
        if (current.length > 0 && current.some(c => c.length > 0)) {
          rows.push(current)
        }
        current = []
      } else {
        field += ch
      }
    }
  }
  // last line
  current.push(field)
  if (current.length > 0 && current.some(c => c.length > 0)) {
    rows.push(current)
  }
  return rows
}

function headerIndex(headers: string[], name: string): number {
  const idx = headers.indexOf(name)
  if (idx === -1) throw new Error(`Header "${name}" not found in ${JSON.stringify(headers)}`)
  return idx
}

async function main() {
  // Read products CSV
  const prodText = fs.readFileSync("prisma/smartphones.csv", "utf-8")
  const prodRows = parseCSV(prodText)
  const prodHeaders = prodRows[0]
  const prodData = prodRows.slice(1)
  console.log(`Products: ${prodData.length} rows`)

  // Read comparisons CSV
  const compText = fs.readFileSync("prisma/comparisons.csv", "utf-8")
  const compRows = parseCSV(compText)
  const compHeaders = compRows[0]
  const compData = compRows.slice(1)
  console.log(`Comparisons: ${compData.length} rows`)

  // Collect all category IDs needed
  const prodCats = new Set<string>()
  for (const row of prodData) {
    prodCats.add(row[headerIndex(prodHeaders, "categoryId")])
  }
  const compCats = new Set<string>()
  for (const row of compData) {
    compCats.add(row[headerIndex(compHeaders, "categoryId")])
  }
  const allCats = new Set([...prodCats, ...compCats])
  console.log("Categories needed:", [...allCats])

  // Clear everything
  console.log("Clearing existing data...")
  await prisma.comparison.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  // Create categories
  for (const catId of allCats) {
    await prisma.category.create({
      data: {
        id: catId,
        name: catId.charAt(0).toUpperCase() + catId.slice(1),
        slug: catId.toLowerCase(),
      },
    })
    console.log(`  Created category: ${catId}`)
  }

  // Import products
  let productCount = 0
  for (const row of prodData) {
    const name = row[headerIndex(prodHeaders, "name")]
    const slug = row[headerIndex(prodHeaders, "slug")]
    const image = row[headerIndex(prodHeaders, "image")]
    const heroImage = row[headerIndex(prodHeaders, "heroImage")] || null
    const description = row[headerIndex(prodHeaders, "description")]
    const price = row[headerIndex(prodHeaders, "price")]
    const rating = parseFloat(row[headerIndex(prodHeaders, "rating")])
    const categoryId = row[headerIndex(prodHeaders, "categoryId")]
    const specs = row[headerIndex(prodHeaders, "specs")]
    const pros = row[headerIndex(prodHeaders, "pros")]
    const cons = row[headerIndex(prodHeaders, "cons")]
    const affiliateLink = row[headerIndex(prodHeaders, "affiliateLink")] || null

    await prisma.product.create({
      data: {
        id: slug,
        name,
        slug,
        image,
        heroImage,
        description,
        price,
        rating,
        categoryId,
        specs,
        pros,
        cons,
        affiliateLink,
      },
    })
    productCount++
  }
  console.log(`Imported ${productCount} products`)

  // Import comparisons
  let compCount = 0
  for (const row of compData) {
    const title = row[headerIndex(compHeaders, "title")]
    const slug = row[headerIndex(compHeaders, "slug")]
    const categoryId = row[headerIndex(compHeaders, "categoryId")]
    const productAId = row[headerIndex(compHeaders, "productAId")]
    const productBId = row[headerIndex(compHeaders, "productBId")]
    const summary = row[headerIndex(compHeaders, "summary")]
    const verdict = row[headerIndex(compHeaders, "verdict")]
    const winnerIndex = parseInt(row[headerIndex(compHeaders, "winnerIndex")], 10)
    const prosPerProductA = row[headerIndex(compHeaders, "prosPerProductA")]
    const consPerProductA = row[headerIndex(compHeaders, "consPerProductA")]
    const prosPerProductB = row[headerIndex(compHeaders, "prosPerProductB")]
    const consPerProductB = row[headerIndex(compHeaders, "consPerProductB")]
    const heroImage = row[headerIndex(compHeaders, "heroImage")] || null

    await prisma.comparison.create({
      data: {
        id: slug,
        title,
        slug,
        description: summary,
        categoryId,
        productAId,
        productBId,
        summary,
        verdict,
        winnerIndex,
        prosPerProductA,
        consPerProductA,
        prosPerProductB,
        consPerProductB,
        heroImage,
      },
    })
    compCount++
  }
  console.log(`Imported ${compCount} comparisons`)

  // Verify
  const [catCount, prodCount, compCount2] = await Promise.all([
    prisma.category.count(),
    prisma.product.count(),
    prisma.comparison.count(),
  ])
  console.log(`\nFinal counts: ${catCount} categories, ${prodCount} products, ${compCount2} comparisons`)
}

main().catch(e => {
  console.error(e)
  process.exit(1)
}).finally(() => prisma.$disconnect())

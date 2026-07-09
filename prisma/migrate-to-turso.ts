import * as dotenv from "dotenv"
import * as path from "path"
dotenv.config()

import { createClient } from "@libsql/client"

const dbPath = path.resolve(process.cwd(), "prisma/dev.db")

const local = createClient({ url: `file:///${dbPath.replace(/\\/g, "/")}` })
const remote = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

async function main() {
  // 1. Push schema to Turso
  console.log("Pushing schema to Turso...")
  const createCategory = `CREATE TABLE IF NOT EXISTS Category (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`
  const createProduct = `CREATE TABLE IF NOT EXISTS Product (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    image TEXT NOT NULL,
    heroImage TEXT,
    description TEXT NOT NULL,
    price TEXT NOT NULL,
    rating REAL NOT NULL,
    categoryId TEXT NOT NULL,
    specs TEXT NOT NULL,
    pros TEXT NOT NULL,
    cons TEXT NOT NULL,
    affiliateLink TEXT,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoryId) REFERENCES Category(id)
  )`
  const createComparison = `CREATE TABLE IF NOT EXISTS Comparison (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    categoryId TEXT NOT NULL,
    productAId TEXT NOT NULL,
    productBId TEXT NOT NULL,
    summary TEXT NOT NULL,
    verdict TEXT NOT NULL,
    winnerIndex INTEGER NOT NULL,
    prosPerProductA TEXT NOT NULL,
    consPerProductA TEXT NOT NULL,
    prosPerProductB TEXT NOT NULL,
    consPerProductB TEXT NOT NULL,
    heroImage TEXT,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoryId) REFERENCES Category(id),
    FOREIGN KEY (productAId) REFERENCES Product(id),
    FOREIGN KEY (productBId) REFERENCES Product(id)
  )`

  await remote.execute(createCategory)
  await remote.execute(createProduct)
  await remote.execute(createComparison)
  console.log("Schema pushed successfully!")

  // 2. Read data from local SQLite
  console.log("Reading local data...")
  const categories = (await local.execute("SELECT * FROM Category")).rows as any[]
  const products = (await local.execute("SELECT * FROM Product")).rows as any[]
  const comparisons = (await local.execute("SELECT * FROM Comparison")).rows as any[]

  console.log(`Found ${categories.length} categories, ${products.length} products, ${comparisons.length} comparisons`)

  // 3. Insert into Turso
  console.log("Migrating categories...")
  for (const cat of categories) {
    await remote.execute({
      sql: `INSERT OR REPLACE INTO Category (id, name, slug, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)`,
      args: [cat.id, cat.name, cat.slug, cat.createdAt, cat.updatedAt],
    })
  }

  console.log("Migrating products...")
  for (const p of products) {
    await remote.execute({
      sql: `INSERT OR REPLACE INTO Product (id, name, slug, image, heroImage, description, price, rating, categoryId, specs, pros, cons, affiliateLink, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [p.id, p.name, p.slug, p.image, p.heroImage, p.description, p.price, p.rating, p.categoryId, p.specs, p.pros, p.cons, p.affiliateLink, p.createdAt, p.updatedAt],
    })
  }

  console.log("Migrating comparisons...")
  for (const comp of comparisons) {
    await remote.execute({
      sql: `INSERT OR REPLACE INTO Comparison (id, title, slug, description, categoryId, productAId, productBId, summary, verdict, winnerIndex, prosPerProductA, consPerProductA, prosPerProductB, consPerProductB, heroImage, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [comp.id, comp.title, comp.slug, comp.description, comp.categoryId, comp.productAId, comp.productBId, comp.summary, comp.verdict, comp.winnerIndex, comp.prosPerProductA, comp.consPerProductA, comp.prosPerProductB, comp.consPerProductB, comp.heroImage, comp.createdAt, comp.updatedAt],
    })
  }

  console.log("Migration complete!")
}

main().catch((e) => {
  console.error("Migration failed:", e)
  process.exit(1)
}).finally(async () => {
  await local.close()
  await remote.close()
})

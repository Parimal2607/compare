import { prisma } from "../src/lib/prisma"

async function main() {
  try {
    await prisma.$executeRawUnsafe("ALTER TABLE Product ADD COLUMN sourceUrl TEXT")
    console.log("Added sourceUrl column to Product table")
  } catch (e) {
    console.log("Column may already exist:", e instanceof Error ? e.message : e)
  }
}

main().catch(console.error)
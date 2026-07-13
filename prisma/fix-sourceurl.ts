import { prisma } from "../src/lib/prisma"

async function main() {
  try {
    await prisma.$executeRawUnsafe("ALTER TABLE Product ADD COLUMN sourceUrl TEXT")
    console.log("Added sourceUrl successfully")
  } catch (e) {
    console.log("Error:", e instanceof Error ? e.message : e)
  }
}

main().catch(console.error)
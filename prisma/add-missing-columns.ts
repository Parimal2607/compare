import { prisma } from "../src/lib/prisma"

async function main() {
  for (const col of ["status", "sourceUrl"]) {
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE Product ADD COLUMN ${col} TEXT`)
      console.log(`Added ${col} column`)
    } catch (e) {
      console.log(`${col}: ${e instanceof Error ? e.message : e}`)
    }
  }
}

main().catch(console.error)
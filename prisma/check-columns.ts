import { prisma } from "../src/lib/prisma"

async function main() {
  try {
    const info = await prisma.$queryRawUnsafe<{cid: number; name: string; type: string}[]>("PRAGMA table_info(Product)")
    console.log("Product columns:", info.map(c => `${c.name} (${c.type})`).join(", "))
  } catch (e) {
    console.log("Error:", e instanceof Error ? e.message : e)
  }
}

main().catch(console.error)
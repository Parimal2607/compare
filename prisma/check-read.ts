import { prisma } from "../src/lib/prisma"

async function main() {
  try {
    const p = await prisma.product.findFirst({ select: { id: true, name: true, sourceUrl: true } })
    console.log("Read result:", p)
  } catch (e) {
    console.log("Error:", e instanceof Error ? e.message : e)
  }
}

main().catch(console.error)
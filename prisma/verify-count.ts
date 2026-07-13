import { prisma } from "../src/lib/prisma"

async function main() {
  const count = await prisma.product.count()
  console.log(`Total products: ${count}`)
  const products = await prisma.product.findMany({ take: 5, select: { id: true, name: true, description: true } })
  for (const p of products) {
    console.log(`- ${p.id}: ${p.name}`)
    console.log(`  ${p.description?.slice(0, 80)}...`)
  }
}

main().catch(console.error)
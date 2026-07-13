import { prisma } from "../src/lib/prisma"
import { generateDescription, rephrasePros, rephraseCons } from "../src/lib/rewrite"

async function main() {
  const products = await prisma.product.findMany({
    include: { category: true },
  })

  console.log(`Found ${products.length} products to rewrite`)

  for (const product of products) {
    const specs = JSON.parse(product.specs) as Record<string, string>
    const oldPros = JSON.parse(product.pros) as string[]
    const oldCons = JSON.parse(product.cons) as string[]

    const newDesc = generateDescription({
      name: product.name,
      category: product.category?.name,
      specs,
      price: product.price,
    })

    const newPros = rephrasePros(oldPros)
    const newCons = rephraseCons(oldCons)

    await prisma.product.update({
      where: { id: product.id },
      data: {
        description: newDesc,
        pros: JSON.stringify(newPros),
        cons: JSON.stringify(newCons),
      },
    })

    console.log(`✓ ${product.name}`)
  }

  console.log("Done rewriting all product descriptions")
}

main().catch(console.error)
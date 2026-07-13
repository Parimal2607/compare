import { prisma } from "@/lib/prisma"
import TicTacToeClient from "./TicTacToeClient"

export default async function TicTacToePage() {
  const products = await prisma.product.findMany({
    select: { name: true, slug: true, image: true },
    orderBy: { name: "asc" },
  })

  return <TicTacToeClient products={products} />
}

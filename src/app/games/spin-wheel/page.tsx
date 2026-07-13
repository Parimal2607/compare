import { prisma } from "@/lib/prisma"
import SpinWheelClient from "./SpinWheelClient"

export default async function SpinWheelPage() {
  const products = await prisma.product.findMany({
    select: { name: true, slug: true },
    orderBy: { name: "asc" },
  })

  return <SpinWheelClient products={products} />
}

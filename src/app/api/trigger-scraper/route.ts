import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const BRANDS: { name: string; fn: () => Promise<{ products: unknown[]; log: string[] }> }[] = [
  { name: "OnePlus", fn: () => import("@/lib/gsmarena-scraper").then((m) => m.autoFetchOnePlusProducts()) },
  { name: "Motorola", fn: () => import("@/lib/gsmarena-scraper").then((m) => m.autoFetchMotorolaProducts()) },
  { name: "Xiaomi", fn: () => import("@/lib/gsmarena-scraper").then((m) => m.autoFetchXiaomiProducts()) },
  { name: "iQOO", fn: () => import("@/lib/gsmarena-scraper").then((m) => m.autoFetchIqooProducts()) },
  { name: "Samsung", fn: () => import("@/lib/gsmarena-scraper").then((m) => m.autoFetchSamsungProducts()) },
  { name: "Google Pixel", fn: () => import("@/lib/gsmarena-scraper").then((m) => m.autoFetchGoogleProducts()) },
]

export const dynamic = "force-dynamic"

export async function GET() {
  const brandIndex = Math.floor(Date.now() / 3600000) % BRANDS.length
  const brand = BRANDS[brandIndex]

  const slug = brand.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || brand.name.toLowerCase()
  const cat = await prisma.category.findFirst({ where: { slug } })
  if (cat) {
    const recent = await prisma.product.findFirst({
      where: { categoryId: cat.id },
      orderBy: { createdAt: "desc" },
    })
    if (recent && Date.now() - recent.createdAt.getTime() < 50 * 60 * 1000) {
      return NextResponse.json({ skipped: true, brand: brand.name, reason: "rate-limited" })
    }
  }

  try {
    const result = await brand.fn()
    return NextResponse.json({ brand: brand.name, products: result.products.length })
  } catch (err) {
    return NextResponse.json({ error: true, brand: brand.name }, { status: 500 })
  }
}

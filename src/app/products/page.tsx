import { getProducts, getCategories } from "@/data/products"
import ProductGrid from "@/components/ProductGrid"
import PageWithSidebar from "@/components/PageWithSidebar"
import { after } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"
export const maxDuration = 30

export const metadata: Metadata = {
  title: "Browse Products",
  description:
    "Browse all reviewed products side-by-side. Compare specs, prices, and ratings to make an informed decision.",
  openGraph: {
    title: "Browse Products | CompareHub",
    description:
      "Browse all reviewed products side-by-side. Compare specs, prices, and ratings to make an informed decision.",
  },
}

const BRANDS: { name: string; fn: () => Promise<{ products: unknown[]; log: string[] }> }[] = [
  { name: "OnePlus", fn: () => import("@/lib/gsmarena-scraper").then((m) => m.autoFetchOnePlusProducts()) },
  { name: "Motorola", fn: () => import("@/lib/gsmarena-scraper").then((m) => m.autoFetchMotorolaProducts()) },
  { name: "Xiaomi", fn: () => import("@/lib/gsmarena-scraper").then((m) => m.autoFetchXiaomiProducts()) },
  { name: "iQOO", fn: () => import("@/lib/gsmarena-scraper").then((m) => m.autoFetchIqooProducts()) },
]

async function shouldRunScraper(brandName: string): Promise<boolean> {
  const slug = brandName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || brandName.toLowerCase()
  const cat = await prisma.category.findFirst({ where: { slug } })
  if (!cat) return true
  const recent = await prisma.product.findFirst({
    where: { categoryId: cat.id },
    orderBy: { createdAt: "desc" },
  })
  if (!recent) return true
  return Date.now() - recent.createdAt.getTime() > 50 * 60 * 1000
}

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ])

  after(async () => {
    const brandIndex = Math.floor(Date.now() / 3600000) % BRANDS.length
    const brand = BRANDS[brandIndex]

    try {
      const ok = await shouldRunScraper(brand.name)
      if (!ok) return

      const result = await brand.fn()
      if (result.products.length > 0) {
        revalidatePath("/products")
        revalidatePath("/")
      }
    } catch {
      // next visit will try
    }
  })

  return <PageWithSidebar><ProductGrid products={products} categories={categories} /></PageWithSidebar>
}

import { getProducts } from "@/data/products"
import { getCategories } from "@/data/products"
import ProductGrid from "@/components/ProductGrid"
import PageWithSidebar from "@/components/PageWithSidebar"
import { after } from "next/server"
import { revalidatePath } from "next/cache"
import type { Metadata } from "next"

export const revalidate = 60
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

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ])

  after(async () => {
    const brands = ["oneplus", "motorola", "xiaomi", "iqoo"] as const
    const { getCachedOnePlusProducts } = await import("@/lib/get-cached-oneplus-products")
    const { getCachedMotorolaProducts } = await import("@/lib/get-cached-motorola-products")
    const { getCachedXiaomiProducts } = await import("@/lib/get-cached-xiaomi-products")
    const { getCachedIqooProducts } = await import("@/lib/get-cached-iqoo-products")
    const fns = [getCachedOnePlusProducts, getCachedMotorolaProducts, getCachedXiaomiProducts, getCachedIqooProducts]

    try {
      const results = await Promise.allSettled(fns.map((fn) => fn()))
      const anyCreated = results.some(
        (r) => r.status === "fulfilled" && r.value.products.length > 0,
      )
      if (anyCreated) {
        revalidatePath("/products")
        revalidatePath("/")
      }
    } catch {
      // best-effort — scrapers will retry on next visit
    }
  })

  return <PageWithSidebar><ProductGrid products={products} categories={categories} /></PageWithSidebar>
}

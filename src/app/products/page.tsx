import { getProducts, getCategories } from "@/data/products"
import ProductGrid from "@/components/ProductGrid"
import PageWithSidebar from "@/components/PageWithSidebar"
import type { Metadata } from "next"

export const revalidate = 60

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

  return <PageWithSidebar><ProductGrid products={products} categories={categories} /></PageWithSidebar>
}

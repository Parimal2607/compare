import { getProducts } from "@/data/products"
import { getCategories } from "@/data/products"
import ProductGrid from "@/components/ProductGrid"

export const revalidate = 60

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ])
  return <ProductGrid products={products} categories={categories} />
}

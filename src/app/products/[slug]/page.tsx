import { getProductBySlug, getProducts, getProductsByCategory } from "@/data/products"
import { getComparionsByProductId, getComparisonsWithProductMap } from "@/data/comparisons"
import ComparisonCard from "@/components/ComparisonCard"
import ProductContent from "./ProductContent"
import PageWithSidebar from "@/components/PageWithSidebar"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { productSchema, breadcrumbSchema } from "@/lib/schema"

interface Props {
  params: Promise<{ slug: string }>
}

export const revalidate = 60

export async function generateStaticParams() {
  const products = await getProducts()
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return {}
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      type: "website",
      ...(product.image ? { images: [{ url: product.image }] } : {}),
    },
    alternates: { canonical: `/products/${product.slug}` },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const relatedComparisons = await getComparionsByProductId(product.id)
  const productMap = relatedComparisons.length > 0 ? await getComparisonsWithProductMap(relatedComparisons) : new Map()
  const allCategoryProducts = await getProductsByCategory(product.categoryId)
  const alternatives = allCategoryProducts.filter((p) => p.id !== product.id).slice(0, 6)

  const pSchema = productSchema(product)
  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/` },
    { name: "Products", url: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/products` },
    { name: product.name, url: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/products/${product.slug}` },
  ])

  return (
    <PageWithSidebar>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <ProductContent
        product={product}
        alternatives={alternatives}
        relatedComparisons={
        relatedComparisons.length > 0 ? (
          <section>
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Related Comparisons</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {relatedComparisons.map((c) => {
                const products = productMap.get(c.id)
                return (
                  <ComparisonCard
                    key={c.id}
                    comparison={c}
                    productA={products?.productA}
                    productB={products?.productB}
                  />
                )
              })}
            </div>
          </section>
        ) : null
      }
    />
    </PageWithSidebar>
  )
}
import Link from "next/link"
import { getCategories, getProducts, getProductsByCategoryName } from "@/data/products"
import { getComparisonsByCategoryName, getAllComparisonCategoryNames, getComparisonsWithProductMap } from "@/data/comparisons"
import ComparisonCard from "@/components/ComparisonCard"
import ProductCard from "@/components/ProductCard"
import Pagination from "@/components/Pagination"

const PRODUCTS_PER_PAGE = 6

export const revalidate = 60

export default async function CategoriesPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams
  const [productCats, comparisonCatNames] = await Promise.all([
    getCategories(),
    getAllComparisonCategoryNames(),
  ])
  const productCatNames = productCats.map((c) => c.name)
  const allCategories = [...new Set([...productCatNames, ...comparisonCatNames])]

  const [allProducts, ...catDataRaw] = await Promise.all([
    getProducts(),
    ...allCategories.map(async (name) => {
      const catComparisons = await getComparisonsByCategoryName(name)
      const catProducts = (await getProductsByCategoryName(name))
      return { name, catComparisons, catProducts }
    }),
  ])

  const allComparisons = catDataRaw.flatMap((d) => d.catComparisons)
  const productMap = allComparisons.length > 0 ? await getComparisonsWithProductMap(allComparisons) : new Map()
  const productMapByCategory = new Map<string, Map<string, { productA: any; productB: any }>>()
  for (const d of catDataRaw) {
    const map = new Map()
    for (const c of d.catComparisons) {
      const p = productMap.get(c.id)
      if (p) map.set(c.id, p)
    }
    productMapByCategory.set(d.name, map)
  }

  const catData = allCategories.map((name) => {
    const raw = catDataRaw.find((d) => d.name === name)
    const catComparisons = raw?.catComparisons ?? []
    const catProducts = raw?.catProducts ?? []
    const cat = productCats.find((c) => c.name === name)
    const pageKey = cat?.slug ?? name.toLowerCase().replace(/\s+/g, "-")
    const currentPage = parseInt(sp[pageKey] || "1", 10)
    const totalPages = Math.ceil(catProducts.length / PRODUCTS_PER_PAGE)
    const paged = catProducts.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE)
    const localMap = productMapByCategory.get(name) ?? new Map()
    return { name, cat, catProducts, catComparisons, paged, currentPage, totalPages, pageKey, localMap }
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Categories</h1>
        <p className="mt-3 text-lg text-gray-500">Browse comparisons and products by category.</p>
      </div>

      <div className="mb-12 flex flex-wrap gap-3">
        {allCategories.map((name) => {
          const anchorId = name.toLowerCase().replace(/\s+/g, "-")
          return (
            <Link
              key={name}
              href={`#${anchorId}`}
              className="group inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all duration-300 hover:border-violet-200 hover:text-violet-700 hover:shadow-md"
            >
              <span className="flex h-2 w-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              {name}
            </Link>
          )
        })}
      </div>

      <div className="space-y-20">
        {catData.map(({ name, cat, catProducts, catComparisons, paged, currentPage, totalPages, pageKey, localMap }) => {
          const anchorId = name.toLowerCase().replace(/\s+/g, "-")
          return (
            <section key={name} id={anchorId}>
              <div className="mb-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-violet-200/50 to-transparent" />
                <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
                <div className="h-px flex-1 bg-gradient-to-l from-blue-200/50 to-transparent" />
              </div>

              {catComparisons.length > 0 && (
                <div className="mb-10">
                  <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-gray-400">Comparisons</h3>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {catComparisons.map((c) => {
                      const products = localMap.get(c.id)
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
                </div>
              )}

              {paged.length > 0 && (
                <div>
                  <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-gray-400">Products</h3>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {paged.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      baseUrl="/categories"
                      pageKey={pageKey}
                    />
                  )}
                </div>
              )}

              {catProducts.length === 0 && catComparisons.length === 0 && (
                <p className="text-gray-500">No content in this category yet.</p>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
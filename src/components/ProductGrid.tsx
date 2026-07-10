"use client"

import { useState, useMemo } from "react"
import type { Product } from "@/data/types"
import ProductCard from "./ProductCard"

const PAGE_SIZE = 12

export default function ProductGrid({
  products,
  categories,
}: {
  products: Product[]
  categories: { id: string; name: string }[]
}) {
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [page, setPage] = useState(0)

  const filtered = useMemo(() => {
    let items = products
    if (categoryFilter) {
      items = items.filter((p) => p.categoryId === categoryFilter)
    }
    if (search) {
      const q = search.toLowerCase()
      items = items.filter((p) => {
        if (p.name.toLowerCase().includes(q)) return true
        if (p.category.toLowerCase().includes(q)) return true
        return false
      })
    }
    return items
  }, [products, search, categoryFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages - 1)
  const paged = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE)

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Products</h1>
        <p className="mt-3 text-lg text-gray-500">Browse all reviewed products.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-8">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0) }}
          className="flex-1 min-w-[200px] rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400 transition-colors"
        />
        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setPage(0) }}
          className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400 transition-colors bg-white"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <span className="text-xs text-gray-400 whitespace-nowrap">
          {filtered.length} product{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
          <p className="text-sm text-gray-400">No products match your criteria.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paged.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={safePage === 0}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    i === safePage
                      ? "bg-violet-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={safePage === totalPages - 1}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

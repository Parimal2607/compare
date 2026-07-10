"use client"

import { useState, useMemo } from "react"
import type { Comparison, Product } from "@/data/types"
import ComparisonCard from "./ComparisonCard"

interface CategoryGroup {
  categoryName: string
  categorySlug: string
  comparisons: Comparison[]
  productData: Record<string, { productA: Product | null; productB: Product | null }>
}

export default function CategoryComparisons({ groups }: { groups: CategoryGroup[] }) {
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    if (!search.trim()) return groups
    const q = search.toLowerCase()
    return groups
      .map((g) => {
        const matched = g.comparisons.filter((c) => {
          if (c.title.toLowerCase().includes(q)) return true
          if (c.category.toLowerCase().includes(q)) return true
          const pd = g.productData[c.id]
          if (pd?.productA?.name?.toLowerCase().includes(q)) return true
          if (pd?.productB?.name?.toLowerCase().includes(q)) return true
          return false
        })
        return matched.length > 0 ? { ...g, comparisons: matched } : null
      })
      .filter(Boolean) as CategoryGroup[]
  }, [groups, search])

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Categories</h1>
        <p className="mt-3 text-lg text-gray-500">Browse comparisons by category.</p>
      </div>

      <div className="mb-8">
        <input
          type="text"
          placeholder="Search comparisons by title, category, or product name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400 transition-colors"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
          <p className="text-sm text-gray-400">No comparisons match your search.</p>
        </div>
      ) : (
        <div className="space-y-16">
          {filtered.map((group) => (
            <section key={group.categorySlug} id={group.categorySlug}>
              <div className="mb-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-violet-200/50 to-transparent" />
                <h2 className="text-2xl font-bold text-gray-900">{group.categoryName}</h2>
                <div className="h-px flex-1 bg-gradient-to-l from-blue-200/50 to-transparent" />
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {group.comparisons.map((comparison) => {
                  const products = group.productData[comparison.id]
                  return (
                    <ComparisonCard
                      key={comparison.id}
                      comparison={comparison}
                      productA={products?.productA}
                      productB={products?.productB}
                    />
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

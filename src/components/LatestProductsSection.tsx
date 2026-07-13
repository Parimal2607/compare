"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import SafeImage from "@/components/SafeImage"
import type { Product } from "@/data/types"

const PAGE_SIZE = 10

export default function LatestProductsSection({ products }: { products: Product[] }) {
  const [page, setPage] = useState(0)

  const latest = products[0]
  const rest = useMemo(() => products.slice(1), [products])

  const totalPages = Math.max(1, Math.ceil(rest.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages - 1)
  const paged = rest.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE)

  const visiblePages = useMemo(() => {
    const pages: (number | "...")[] = []
    if (totalPages <= 7) {
      for (let i = 0; i < totalPages; i++) pages.push(i)
    } else {
      pages.push(0)
      if (safePage > 2) pages.push("...")
      for (let i = Math.max(1, safePage - 1); i <= Math.min(totalPages - 2, safePage + 1); i++) {
        pages.push(i)
      }
      if (safePage < totalPages - 3) pages.push("...")
      pages.push(totalPages - 1)
    }
    return pages
  }, [totalPages, safePage])

  if (products.length === 0) return null

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center">
          Latest Products
        </h2>
        <p className="mt-2 text-gray-500 text-center">Newly added products with full specifications</p>

        {latest && (
          <div className="mt-10 mb-14 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="grid sm:grid-cols-5">
              <div className="relative h-56 sm:h-full sm:col-span-2 bg-gray-50">
                <SafeImage
                  src={latest.heroImage || latest.image}
                  alt={latest.name}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 640px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20" />
              </div>
              <div className="sm:col-span-3 p-6 sm:p-8">
                <span className="inline-flex items-center rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700 mb-3">
                  {latest.category}
                </span>
                <Link href={`/products/${latest.slug}`} className="group">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-violet-600 transition-colors">
                    {latest.name}
                  </h3>
                </Link>
                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <span className="text-2xl font-bold text-gray-900">{latest.price}</span>
                  {latest.rating != null && (
                    <span className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-600">
                      {latest.rating}
                      <svg className="h-4 w-4 fill-amber-400" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </span>
                  )}
                </div>
                <p className="mt-4 text-gray-500 leading-relaxed line-clamp-3">{latest.description}</p>
                <div className="mt-6">
                  <Link
                    href={`/products/${latest.slug}`}
                    className="inline-flex h-10 items-center gap-1.5 rounded-full bg-violet-600 px-5 text-sm font-semibold text-white shadow-sm transition-all duration-500 hover:bg-violet-700 hover:shadow-md active:scale-[0.98]"
                  >
                    View Details
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
            {Object.keys(latest.specs).length > 0 && (
              <div className="border-t border-gray-100 px-6 py-4 sm:px-8">
                <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                  {Object.entries(latest.specs).slice(0, 4).map(([key, val]) => (
                    <div key={key}>
                      <span className="text-gray-400">{key}:</span>{" "}
                      <span className="font-medium text-gray-700">{val}</span>
                    </div>
                  ))}
                  {Object.keys(latest.specs).length > 4 && (
                    <span className="text-violet-600 text-xs self-center">
                      +{Object.keys(latest.specs).length - 4} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {rest.length > 0 && (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {paged.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group relative block overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="relative h-36 overflow-hidden bg-gray-50">
                    <SafeImage
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-3 transition-all duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] font-medium text-violet-600 uppercase tracking-wider">{product.category}</span>
                    <h3 className="mt-0.5 font-semibold text-gray-900 text-sm group-hover:text-violet-600 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-900">{product.price}</span>
                      {product.rating != null && (
                        <span className="text-xs font-medium text-amber-600">{product.rating}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-1.5 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={safePage === 0}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  ← Prev
                </button>
                {visiblePages.map((p, i) =>
                  p === "..." ? (
                    <span key={`ellipsis-${i}`} className="px-1 text-xs text-gray-400">...</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                        p === safePage
                          ? "bg-violet-600 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {p + 1}
                    </button>
                  )
                )}
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
    </section>
  )
}
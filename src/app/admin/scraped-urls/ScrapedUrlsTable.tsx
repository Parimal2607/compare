"use client"

import { useState, useMemo } from "react"
import Link from "next/link"

const PAGE_SIZE = 10

export default function ScrapedUrlsTable({
  products,
  siteUrl,
}: {
  products: { id: string; name: string; slug: string; category: { name: string } }[]
  siteUrl: string
}) {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(0)

  const filtered = useMemo(() => {
    if (!search) return products
    const q = search.toLowerCase()
    return products.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q) ||
      p.category.name.toLowerCase().includes(q)
    )
  }, [products, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages - 1)
  const paged = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE)

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
    } catch { }
  }

  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copy = async (id: string, url: string) => {
    await handleCopy(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

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

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by name, slug, or category..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0) }}
          className="flex-1 min-w-[200px] rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400 transition-colors"
        />
        <span className="text-xs text-gray-400 whitespace-nowrap">
          {filtered.length} product{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <p className="px-6 py-10 text-center text-sm text-gray-400">No products found.</p>
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-6 py-3 text-left font-semibold text-gray-600">Product</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600">Category</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600 hidden sm:table-cell">Public URL</th>
                    <th className="px-6 py-3 text-right font-semibold text-gray-600">Copy</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((p) => {
                    const url = `${siteUrl.replace(/\/+$/, "")}/products/${p.slug}`
                    return (
                      <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{p.name}</div>
                          <div className="text-xs text-gray-400 font-mono mt-0.5">{p.slug}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{p.category.name}</td>
                        <td className="px-6 py-4 hidden sm:table-cell">
                          <Link href={url} target="_blank" className="text-violet-600 hover:text-violet-700 underline underline-offset-2 font-mono text-xs break-all">
                            {url}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => copy(p.id, url)}
                            className="rounded-lg px-3 py-1.5 text-xs font-medium text-violet-600 hover:bg-violet-50 transition-colors"
                          >
                            {copiedId === p.id ? "Copied!" : "Copy URL"}
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4">
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
  )
}

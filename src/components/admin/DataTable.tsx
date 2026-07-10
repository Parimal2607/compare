"use client"

import { useState, useMemo, ReactNode } from "react"

type Row = Record<string, unknown> & { id: string; category?: { name: string; id: string } | null }

interface DataTableProps<T extends Row> {
  data: T[]
  categories: { id: string; name: string }[]
  searchFields: (keyof T)[]
  labelKey: keyof T
  renderTable: (items: T[]) => ReactNode
  pageSize?: number
  emptyMessage?: string
}

export default function DataTable<T extends Row>({
  data, categories, searchFields, labelKey, renderTable, pageSize = 10, emptyMessage = "No items yet.",
}: DataTableProps<T>) {
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [page, setPage] = useState(0)

  const filtered = useMemo(() => {
    let items = data
    if (categoryFilter) {
      items = items.filter((item) => item.category?.id === categoryFilter)
    }
    if (search) {
      const q = search.toLowerCase()
      items = items.filter((item) => {
        for (const field of searchFields) {
          const val = item[field]
          if (typeof val === "string" && val.toLowerCase().includes(q)) return true
        }
        if (item.category?.name?.toLowerCase().includes(q)) return true
        return false
      })
    }
    return items
  }, [data, search, categoryFilter, searchFields])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages - 1)
  const paged = filtered.slice(safePage * pageSize, (safePage + 1) * pageSize)

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="text"
          placeholder={`Search ${String(labelKey).toLowerCase()} or category...`}
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
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <p className="px-6 py-10 text-center text-sm text-gray-400">{emptyMessage}</p>
        </div>
      ) : (
        renderTable(paged)
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
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
    </div>
  )
}

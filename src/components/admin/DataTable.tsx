"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { DeleteButton } from "./DeleteButton"

function CellValue({ value }: { value: unknown }) {
  if (value === null || value === undefined) return <span className="text-gray-300">—</span>
  if (typeof value === "object" && "name" in (value as object)) return <>{String((value as { name: string }).name)}</>
  return <>{String(value)}</>
}

type Row = Record<string, unknown> & {
  id: string
  category?: { name: string; id: string } | null
  slug?: string | null
  name?: string | null
  title?: string | null
  price?: string | null
}

interface Column<T extends Row> {
  key: string
  label: string
}

interface DataTableProps<T extends Row> {
  data: T[]
  categories: { id: string; name: string }[]
  searchFields: (keyof T)[]
  labelKey: keyof T
  slugKey?: keyof T
  columns: Column<T>[]
  editUrlPrefix: string
  onDelete: (formData: FormData) => void
  deleteConfirmMsg?: string
  pageSize?: number
  emptyMessage?: string
}

export default function DataTable<T extends Row>({
  data, categories, searchFields, labelKey, slugKey = "slug" as keyof T,
  columns, editUrlPrefix, onDelete, deleteConfirmMsg = "Delete?",
  pageSize = 10, emptyMessage = "No items yet.",
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
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {columns.map((col) => (
                  <th key={col.key} className="px-6 py-3 text-left font-semibold text-gray-600">{col.label}</th>
                ))}
                <th className="px-6 py-3 text-right font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((item) => {
                const label = String(item[labelKey] ?? "")
                const slug = slugKey ? String(item[slugKey] ?? "") : ""
                return (
                  <tr key={item.id} className="border-b border-gray-50 last:border-0">
                    {columns.map((col) => (
                      <td key={col.key} className="px-6 py-4 text-gray-500">
                        {col.key === labelKey ? (
                          <>
                            <div className="font-medium text-gray-900">{label}</div>
                            {slug && <div className="text-xs text-gray-400 font-mono mt-0.5">{slug}</div>}
                          </>
                        ) : (
                          <CellValue value={item[col.key]} />
                        )}
                      </td>
                    ))}
                    <td className="px-6 py-4 text-right">
                      <Link href={`${editUrlPrefix}${item.id}/edit`} className="rounded-lg px-3 py-1.5 text-xs font-medium text-violet-600 hover:bg-violet-50 transition-colors">Edit</Link>
                      <form action={onDelete} className="inline ml-1">
                        <input type="hidden" name="id" value={item.id} />
                        <DeleteButton label="Delete" confirmMsg={deleteConfirmMsg} />
                      </form>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
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

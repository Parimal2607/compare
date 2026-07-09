import Link from "next/link"

function getPageRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | "...")[] = [1]
  if (current > 3) pages.push("...")

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)

  if (current < total - 2) pages.push("...")
  pages.push(total)

  return pages
}

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  params,
  pageKey = "page",
}: {
  currentPage: number
  totalPages: number
  baseUrl: string
  params?: Record<string, string>
  pageKey?: string
}) {
  if (totalPages <= 1) return null

  function href(page: number) {
    const p = new URLSearchParams()
    if (params) {
      for (const [key, val] of Object.entries(params)) {
        if (val) p.set(key, val)
      }
    }
    p.set(pageKey, String(page))
    return `${baseUrl}?${p.toString()}`
  }

  const range = getPageRange(currentPage, totalPages)

  return (
    <div className="mt-10 flex items-center justify-center gap-1.5 sm:gap-2">
      {currentPage > 1 && (
        <Link
          href={href(currentPage - 1)}
          className="inline-flex h-9 sm:h-10 items-center rounded-xl border border-gray-200 bg-white px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-600 shadow-sm transition-all hover:border-violet-200 hover:text-violet-700"
        >
          <svg className="h-4 w-4 sm:mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">Previous</span>
        </Link>
      )}

      {range.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="inline-flex h-9 sm:h-10 w-8 sm:w-10 items-center justify-center text-sm text-gray-400 select-none">
            ...
          </span>
        ) : (
          <Link
            key={p}
            href={href(p)}
            className={`inline-flex h-9 sm:h-10 min-w-[2.25rem] sm:min-w-[2.5rem] items-center justify-center rounded-xl text-xs sm:text-sm font-medium shadow-sm transition-all ${
              p === currentPage
                ? "bg-violet-600 text-white shadow-md"
                : "border border-gray-200 bg-white text-gray-600 hover:border-violet-200 hover:text-violet-700"
            }`}
          >
            {p}
          </Link>
        )
      )}

      {currentPage < totalPages && (
        <Link
          href={href(currentPage + 1)}
          className="inline-flex h-9 sm:h-10 items-center rounded-xl border border-gray-200 bg-white px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-600 shadow-sm transition-all hover:border-violet-200 hover:text-violet-700"
        >
          <span className="hidden sm:inline">Next</span>
          <svg className="h-4 w-4 sm:ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  )
}

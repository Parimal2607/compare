"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import type { NewsArticle } from "@/lib/news"

export default function NewsSidebar() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/news")
      .then((r) => r.json())
      .then((data) => {
        setArticles(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <aside className="w-full lg:w-80 shrink-0 mr-8 mt-8">
      <div className="sticky top-8 space-y-4 p-4 pt-2 rounded-2xl border border-gray-100 bg-white shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Tech News</h2>

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-1.5" />
                <div className="h-2 bg-gray-100 rounded w-full" />
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <p className="text-sm text-gray-400">No news available.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {articles.slice(0, 12).map((article) => (
              <Link
                key={article.slug}
                href={`/news/${article.slug}`}
                className="block py-3 group"
              >
                <div className="flex gap-3">
                  {article.image && (
                    <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-gray-100 shadow-sm ring-1 ring-gray-100 transition-all duration-300 group-hover:shadow-md group-hover:ring-violet-200">
                      <img
                        src={article.image}
                        alt=""
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-violet-600 transition-colors leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-1">
                      {article.source} · {timeAgo(article.published)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = now - then
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}
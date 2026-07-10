"use client"

import { useState } from "react"

interface Props {
  categories: { id: string; name: string }[]
}

interface ScrapedData {
  name: string
  description: string
  image: string
  price: string
  rating: number
  specs: Record<string, string>
  pros: string[]
  cons: string[]
  allRatings: Record<string, string>
  prices: Record<string, string>
  allImages: string[]
  allMeta: Record<string, string>
  rawJsonLd: Record<string, unknown>[]
}

export default function ImportTool({ categories }: Props) {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [data, setData] = useState<ScrapedData | null>(null)
  const [editable, setEditable] = useState<ScrapedData | null>(null)
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showExtra, setShowExtra] = useState(false)

  async function handleScrape() {
    if (!url.trim()) return
    setLoading(true)
    setError("")
    setData(null)
    setEditable(null)
    setSaved(false)
    try {
      const res = await fetch("/api/admin/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      })
      if (!res.ok) {
        const err = await res.text()
        throw new Error(err || "Failed to scrape")
      }
      const scraped: ScrapedData = await res.json()
      setData(scraped)
      setEditable(scraped)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Scraping failed")
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!editable || !categoryId) return
    setSaving(true)
    setError("")
    try {
      const formData = new FormData()
      formData.set("name", editable.name)
      formData.set("description", editable.description)
      formData.set("image", editable.image)
      formData.set("price", editable.price)
      formData.set("rating", editable.rating.toString())
      formData.set("categoryId", categoryId)
      formData.set("specs", JSON.stringify(editable.specs))
      formData.set("pros", JSON.stringify(editable.pros))
      formData.set("cons", JSON.stringify(editable.cons))
      formData.set("affiliateLink", "")

      const res = await fetch("/api/admin/products", {
        method: "POST",
        body: formData,
      })
      if (!res.ok) {
        const err = await res.text()
        throw new Error(err || "Failed to save")
      }
      setSaved(true)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  function updateField(field: keyof ScrapedData, value: string | number | string[] | Record<string, string>) {
    if (!editable) return
    setEditable({ ...editable, [field]: value })
  }

  if (saved) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Product Saved!</h2>
        <p className="text-gray-500 mb-6">{editable?.name} has been added.</p>
        <button
          onClick={() => { setUrl(""); setData(null); setEditable(null); setSaved(false) }}
          className="rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 transition-all"
        >
          Import Another
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* URL Input */}
      <div className="flex gap-3">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/product/..."
          className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-violet-500"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button
          onClick={handleScrape}
          disabled={loading || !url.trim()}
          className="rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? "Scraping..." : "Scrape"}
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">{error}</div>
      )}

      {/* Scraped Data Form */}
      {editable && (
        <div className="space-y-5 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900">Extracted Data</h3>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={editable.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="text"
                value={editable.price}
                onChange={(e) => updateField("price", e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={editable.rating}
                onChange={(e) => updateField("rating", parseFloat(e.target.value) || 0)}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="url"
                value={editable.image}
                onChange={(e) => updateField("image", e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={editable.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-violet-500"
            />
          </div>

          {Object.keys(editable.allRatings).length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <h4 className="text-sm font-semibold text-amber-800 mb-2">Multi-Source Ratings Found</h4>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(editable.allRatings).map(([source, val]) => (
                  <div key={source} className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm border border-amber-100">
                    <span className="text-gray-600">{source}</span>
                    <span className="font-semibold text-amber-700">{val}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-amber-600 mt-2">These will be added to product specs</p>
            </div>
          )}

          {Object.keys(editable.prices).length > 0 && (
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">Prices from Multiple Sources</h4>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(editable.prices).map(([store, val]) => (
                  <div key={store} className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm border border-blue-100">
                    <span className="text-gray-600">{store}</span>
                    <span className="font-semibold text-blue-700">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Specs</label>
            <textarea
              value={Object.entries(editable.specs).map(([k, v]) => `${k}: ${v}`).join("\n")}
              onChange={(e) => {
                const specs: Record<string, string> = {}
                e.target.value.split("\n").forEach((line) => {
                  const idx = line.indexOf(":")
                  if (idx > 0) specs[line.slice(0, idx).trim()] = line.slice(idx + 1).trim()
                })
                updateField("specs", specs)
              }}
              rows={8}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-violet-500 font-mono"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pros (one per line)</label>
              <textarea
                value={editable.pros.join("\n")}
                onChange={(e) => updateField("pros", e.target.value.split("\n").filter(Boolean))}
                rows={5}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cons (one per line)</label>
              <textarea
                value={editable.cons.join("\n")}
                onChange={(e) => updateField("cons", e.target.value.split("\n").filter(Boolean))}
                rows={5}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-violet-500"
              />
            </div>
          </div>

          {/* Collapsible extra data */}
          <button
            onClick={() => setShowExtra(!showExtra)}
            className="text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors"
          >
            {showExtra ? "Hide" : "Show"} raw extracted data ({editable.allImages.length} images, {Object.keys(editable.allMeta).length} meta tags, {editable.rawJsonLd.length} JSON-LD blocks)
          </button>

          {showExtra && (
            <div className="space-y-4 border-t border-gray-200 pt-4">
              {editable.allImages.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">All Images ({editable.allImages.length})</h4>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto">
                    {editable.allImages.map((img, i) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                        <img src={img} alt="" className="object-contain w-full h-full" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {editable.rawJsonLd.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Structured Data (JSON-LD)</h4>
                  <pre className="max-h-48 overflow-y-auto rounded-xl bg-gray-50 border border-gray-200 p-4 text-xs text-gray-600 font-mono">
                    {JSON.stringify(editable.rawJsonLd, null, 2)}
                  </pre>
                </div>
              )}

              {Object.keys(editable.allMeta).length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">All Meta Tags</h4>
                  <div className="max-h-48 overflow-y-auto rounded-xl bg-gray-50 border border-gray-200 p-4">
                    {Object.entries(editable.allMeta).map(([k, v]) => (
                      <div key={k} className="flex gap-2 text-xs py-0.5 border-b border-gray-100 last:border-0">
                        <span className="font-medium text-gray-500 shrink-0 w-48 truncate">{k}</span>
                        <span className="text-gray-700 truncate">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              onClick={() => { setData(null); setEditable(null) }}
              className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50 transition-all"
            >
              {saving ? "Saving..." : "Save Product"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

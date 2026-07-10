"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface Props {
  categories: { id: string; name: string }[]
  products: { id: string; name: string; categoryId: string }[]
  comparison?: ComparisonFormData
  action: "create" | "update"
}

export interface ComparisonFormData {
  id: string
  title: string
  slug: string
  description: string
  categoryId: string
  productAId: string
  productBId: string
  summary: string
  verdict: string
  winnerIndex: number
  prosA: string[]
  consA: string[]
  prosB: string[]
  consB: string[]
  heroImage: string
}

export default function ComparisonForm({ categories, products, comparison, action }: Props) {
  const router = useRouter()
  const isUpdate = action === "update"
  const [autoSlug, setAutoSlug] = useState(true)
  const [catId, setCatId] = useState(comparison?.categoryId || categories[0]?.id || "")
  const [prosA, setProsA] = useState<string[]>(comparison?.prosA || [""])
  const [consA, setConsA] = useState<string[]>(comparison?.consA || [""])
  const [prosB, setProsB] = useState<string[]>(comparison?.prosB || [""])
  const [consB, setConsB] = useState<string[]>(comparison?.consB || [""])

  const filteredProducts = products.filter((p) => p.categoryId === catId)

  function genSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    fd.set("prosA", JSON.stringify(prosA.filter(Boolean)))
    fd.set("consA", JSON.stringify(consA.filter(Boolean)))
    fd.set("prosB", JSON.stringify(prosB.filter(Boolean)))
    fd.set("consB", JSON.stringify(consB.filter(Boolean)))
    if (isUpdate) fd.set("id", comparison!.id)

    const res = await fetch("/api/admin/comparisons", {
      method: isUpdate ? "PUT" : "POST",
      body: fd,
    })
    if (res.ok) router.push("/admin/comparisons")
    else alert("Error saving comparison")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-gray-500">Title</label>
          <input name="title" defaultValue={comparison?.title || ""} required onChange={e => { if (autoSlug) (document.getElementsByName("slug")[0] as HTMLInputElement).value = genSlug(e.target.value) }}
            className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500">
            Slug
            <button type="button" onClick={() => setAutoSlug(!autoSlug)} className="ml-2 text-[10px] text-violet-500 hover:text-violet-700">{autoSlug ? "auto" : "manual"}</button>
          </label>
          <input name="slug" defaultValue={comparison?.slug || ""} required
            className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500">Category</label>
          <select name="categoryId" value={catId} onChange={e => setCatId(e.target.value)} required
            className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100">
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500">Winner Index</label>
          <select name="winnerIndex" defaultValue={comparison?.winnerIndex ?? 0} required
            className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100">
            <option value={0}>Product A wins</option>
            <option value={1}>Product B wins</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500">Product A</label>
          <select name="productAId" defaultValue={comparison?.productAId || ""} required
            className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100">
            <option value="">Select...</option>
            {filteredProducts.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500">Product B</label>
          <select name="productBId" defaultValue={comparison?.productBId || ""} required
            className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100">
            <option value="">Select...</option>
            {filteredProducts.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-gray-500">Hero Image URL (optional)</label>
          <input name="heroImage" defaultValue={comparison?.heroImage || ""} placeholder="https://..."
            className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-500">Description</label>
        <textarea name="description" defaultValue={comparison?.description || ""} rows={2} required
          className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
      </div>
      <div>
        <label className="text-xs font-medium text-gray-500">Summary</label>
        <textarea name="summary" defaultValue={comparison?.summary || ""} rows={2} required
          className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
      </div>
      <div>
        <label className="text-xs font-medium text-gray-500">Verdict</label>
        <textarea name="verdict" defaultValue={comparison?.verdict || ""} rows={3} required
          className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <fieldset>
          <legend className="text-xs font-medium text-gray-500 mb-2">Product A — Pros</legend>
          {prosA.map((p, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input value={p} onChange={e => { const s = [...prosA]; s[i] = e.target.value; setProsA(s) }} placeholder="Pro"
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-violet-400" />
              <button type="button" onClick={() => setProsA(prosA.filter((_, j) => j !== i))} className="text-red-400 px-2 text-sm">✕</button>
            </div>
          ))}
          <button type="button" onClick={() => setProsA([...prosA, ""])} className="text-xs text-emerald-600">+ Add pro</button>
        </fieldset>
        <fieldset>
          <legend className="text-xs font-medium text-gray-500 mb-2">Product A — Cons</legend>
          {consA.map((c, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input value={c} onChange={e => { const s = [...consA]; s[i] = e.target.value; setConsA(s) }} placeholder="Con"
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-violet-400" />
              <button type="button" onClick={() => setConsA(consA.filter((_, j) => j !== i))} className="text-red-400 px-2 text-sm">✕</button>
            </div>
          ))}
          <button type="button" onClick={() => setConsA([...consA, ""])} className="text-xs text-red-400">+ Add con</button>
        </fieldset>
        <fieldset>
          <legend className="text-xs font-medium text-gray-500 mb-2">Product B — Pros</legend>
          {prosB.map((p, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input value={p} onChange={e => { const s = [...prosB]; s[i] = e.target.value; setProsB(s) }} placeholder="Pro"
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-violet-400" />
              <button type="button" onClick={() => setProsB(prosB.filter((_, j) => j !== i))} className="text-red-400 px-2 text-sm">✕</button>
            </div>
          ))}
          <button type="button" onClick={() => setProsB([...prosB, ""])} className="text-xs text-emerald-600">+ Add pro</button>
        </fieldset>
        <fieldset>
          <legend className="text-xs font-medium text-gray-500 mb-2">Product B — Cons</legend>
          {consB.map((c, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input value={c} onChange={e => { const s = [...consB]; s[i] = e.target.value; setConsB(s) }} placeholder="Con"
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-violet-400" />
              <button type="button" onClick={() => setConsB(consB.filter((_, j) => j !== i))} className="text-red-400 px-2 text-sm">✕</button>
            </div>
          ))}
          <button type="button" onClick={() => setConsB([...consB, ""])} className="text-xs text-red-400">+ Add con</button>
        </fieldset>
      </div>

      <div className="flex justify-end pt-2">
        <button type="submit" className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all">
          {isUpdate ? "Update Comparison" : "Create Comparison"}
        </button>
      </div>
    </form>
  )
}

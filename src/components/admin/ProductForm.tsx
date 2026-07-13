"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface Props {
  categories: { id: string; name: string }[]
  product?: ProductFormData
  action: "create" | "update"
}

export interface ProductFormData {
  id: string
  name: string
  slug: string
  image: string
  heroImage: string
  description: string
  price: string
  rating: number | null
  categoryId: string
  specs: [string, string][]
  pros: string[]
  cons: string[]
  affiliateLink: string
}

export default function ProductForm({ categories, product, action }: Props) {
  const router = useRouter()
  const isUpdate = action === "update"
  const [autoSlug, setAutoSlug] = useState(true)
  const [specs, setSpecs] = useState<[string, string][]>(product?.specs || [["", ""]])
  const [pros, setPros] = useState<string[]>(product?.pros || [""])
  const [cons, setCons] = useState<string[]>(product?.cons || [""])

  function genSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    fd.set("specs", JSON.stringify(specs.filter(([k]) => k.trim())))
    fd.set("pros", JSON.stringify(pros.filter(Boolean)))
    fd.set("cons", JSON.stringify(cons.filter(Boolean)))
    if (isUpdate) fd.set("id", product!.id)

    const res = await fetch("/api/admin/products", {
      method: isUpdate ? "PUT" : "POST",
      body: fd,
    })
    if (res.ok) router.push("/admin/products")
    else alert("Error saving product")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-gray-500">Name</label>
          <input name="name" defaultValue={product?.name || ""} required onChange={e => { if (autoSlug) (document.getElementsByName("slug")[0] as HTMLInputElement).value = genSlug(e.target.value) }}
            className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500">
            Slug
            <button type="button" onClick={() => setAutoSlug(!autoSlug)} className="ml-2 text-[10px] text-violet-500 hover:text-violet-700">{autoSlug ? "auto" : "manual"}</button>
          </label>
          <input name="slug" defaultValue={product?.slug || ""} required
            className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500">Category</label>
          <select name="categoryId" defaultValue={product?.categoryId || categories[0]?.id} required
            className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100">
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500">Price</label>
          <input name="price" defaultValue={product?.price || ""} placeholder="$0.00" required
            className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500">Rating (0–5)</label>
          <input name="rating" type="number" step="0.1" min="0" max="5" defaultValue={product?.rating || 0} required
            className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500">Image URL</label>
          <input name="image" defaultValue={product?.image || ""} placeholder="https://..." required
            className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500">Hero Image URL (optional)</label>
          <input name="heroImage" defaultValue={product?.heroImage || ""} placeholder="https://..."
            className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500">Affiliate Link (optional)</label>
          <input name="affiliateLink" defaultValue={product?.affiliateLink || ""} placeholder="https://..."
            className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-500">Description</label>
        <textarea name="description" defaultValue={product?.description || ""} rows={3} required
          className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
      </div>

      <fieldset>
        <legend className="text-xs font-medium text-gray-500 mb-2">Specs (key-value pairs)</legend>
        <div className="space-y-2">
          {specs.map(([k, v], i) => (
            <div key={i} className="flex gap-2">
              <input placeholder="Key" value={k} onChange={e => { const s = [...specs]; s[i][0] = e.target.value; setSpecs(s) }}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
              <input placeholder="Value" value={v} onChange={e => { const s = [...specs]; s[i][1] = e.target.value; setSpecs(s) }}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
              <button type="button" onClick={() => setSpecs(specs.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 px-2 text-sm">✕</button>
            </div>
          ))}
          <button type="button" onClick={() => setSpecs([...specs, ["", ""]])} className="text-xs text-violet-600 hover:text-violet-800">+ Add spec</button>
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <fieldset>
          <legend className="text-xs font-medium text-gray-500 mb-2">Pros</legend>
          <div className="space-y-2">
            {pros.map((p, i) => (
              <div key={i} className="flex gap-2">
                <input placeholder="Pro" value={p} onChange={e => { const s = [...pros]; s[i] = e.target.value; setPros(s) }}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
                <button type="button" onClick={() => setPros(pros.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 px-2 text-sm">✕</button>
              </div>
            ))}
            <button type="button" onClick={() => setPros([...pros, ""])} className="text-xs text-emerald-600 hover:text-emerald-800">+ Add pro</button>
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-xs font-medium text-gray-500 mb-2">Cons</legend>
          <div className="space-y-2">
            {cons.map((c, i) => (
              <div key={i} className="flex gap-2">
                <input placeholder="Con" value={c} onChange={e => { const s = [...cons]; s[i] = e.target.value; setCons(s) }}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
                <button type="button" onClick={() => setCons(cons.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 px-2 text-sm">✕</button>
              </div>
            ))}
            <button type="button" onClick={() => setCons([...cons, ""])} className="text-xs text-red-400 hover:text-red-600">+ Add con</button>
          </div>
        </fieldset>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="submit" className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all">
          {isUpdate ? "Update Product" : "Create Product"}
        </button>
      </div>
    </form>
  )
}

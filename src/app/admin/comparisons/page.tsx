import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import Link from "next/link"
import ComparisonForm, { ComparisonFormData } from "@/components/admin/ComparisonForm"
import { DeleteButton } from "@/components/admin/DeleteButton"
import DataTable from "@/components/admin/DataTable"

async function deleteComp(formData: FormData) {
  "use server"
  const id = formData.get("id") as string
  await prisma.comparison.delete({ where: { id } })
  revalidatePath("/admin/comparisons")
  revalidatePath("/")
}

function safeArr(val: string): string[] {
  try { const p = JSON.parse(val); return Array.isArray(p) ? p : [] } catch { return [] }
}

export default async function AdminComparisons({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams
  const [comparisons, categories, products] = await Promise.all([
    prisma.comparison.findMany({ orderBy: { title: "asc" }, include: { category: true } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({ orderBy: { name: "asc" } }),
  ])

  const editingId = sp.edit
  const editingComp = editingId ? comparisons.find((c) => c.id === editingId) : null
  const showForm = sp.new === "1" || editingComp

  function toFormData(c: typeof comparisons[0]): ComparisonFormData {
    return {
      id: c.id, title: c.title, slug: c.slug, description: c.description,
      categoryId: c.categoryId, productAId: c.productAId, productBId: c.productBId,
      summary: c.summary, verdict: c.verdict, winnerIndex: c.winnerIndex,
      prosA: safeArr(c.prosPerProductA), consA: safeArr(c.consPerProductA),
      prosB: safeArr(c.prosPerProductB), consB: safeArr(c.consPerProductB),
      heroImage: c.heroImage || "",
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Comparisons</h1>
        <Link href={showForm ? "/admin/comparisons" : "/admin/comparisons?new=1"}
          className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all">
          {showForm ? "← Back" : "+ Add Comparison"}
        </Link>
      </div>

      {showForm && (
        <div className="mb-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">{editingComp ? "Edit Comparison" : "New Comparison"}</h2>
          <ComparisonForm
            categories={categories.map((c) => ({ id: c.id, name: c.name }))}
            products={products.map((p) => ({ id: p.id, name: p.name, categoryId: p.categoryId }))}
            comparison={editingComp ? toFormData(editingComp) : undefined}
            action={editingComp ? "update" : "create"}
          />
        </div>
      )}

      <DataTable
        data={comparisons}
        categories={categories}
        searchFields={["title", "slug"]}
        labelKey="title"
        renderTable={(items) => (
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-3 text-left font-semibold text-gray-600">Title</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600">Category</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600">Products</th>
                  <th className="px-6 py-3 text-right font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((c) => {
                  const pA = products.find((p) => p.id === c.productAId)
                  const pB = products.find((p) => p.id === c.productBId)
                  return (
                    <tr key={c.id} className="border-b border-gray-50 last:border-0">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{c.title}</div>
                        <div className="text-xs text-gray-400 font-mono mt-0.5">{c.slug}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{c.category?.name || c.categoryId}</td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {pA?.name || c.productAId} <span className="text-violet-500 font-bold">vs</span> {pB?.name || c.productBId}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/admin/comparisons?edit=${c.id}`} className="rounded-lg px-3 py-1.5 text-xs font-medium text-violet-600 hover:bg-violet-50 transition-colors">Edit</Link>
                        <form action={deleteComp} className="inline ml-1">
                          <input type="hidden" name="id" value={c.id} />
                          <DeleteButton label="Delete" confirmMsg="Delete this comparison?" />
                        </form>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      />
    </div>
  )
}

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import ProductForm, { ProductFormData } from "@/components/admin/ProductForm"
import { DeleteButton } from "@/components/admin/DeleteButton"
import DataTable from "@/components/admin/DataTable"
import Link from "next/link"

async function deleteProd(formData: FormData) {
  "use server"
  const id = formData.get("id") as string
  await prisma.comparison.deleteMany({ where: { OR: [{ productAId: id }, { productBId: id }] } })
  await prisma.product.delete({ where: { id } })
  revalidatePath("/admin/products")
  revalidatePath("/")
}

export default async function AdminProducts({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ orderBy: { name: "asc" }, include: { category: true } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ])

  const editingId = sp.edit
  const editingProduct = editingId ? products.find((p) => p.id === editingId) : null
  const showForm = sp.new === "1" || editingProduct

  function toFormData(p: typeof products[0]): ProductFormData {
    return {
      id: p.id, name: p.name, slug: p.slug, image: p.image, heroImage: p.heroImage || "",
      description: p.description, price: p.price, rating: p.rating, categoryId: p.categoryId,
      specs: safeParsePairs(p.specs), pros: safeParseArray(p.pros), cons: safeParseArray(p.cons),
      affiliateLink: p.affiliateLink || "",
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Link href={showForm ? "/admin/products" : "/admin/products?new=1"}
          className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all">
          {showForm ? "← Back" : "+ Add Product"}
        </Link>
      </div>

      {showForm && (
        <div className="mb-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">{editingProduct ? "Edit Product" : "New Product"}</h2>
          <ProductForm categories={categories.map((c) => ({ id: c.id, name: c.name }))} product={editingProduct ? toFormData(editingProduct) : undefined} action={editingProduct ? "update" : "create"} />
        </div>
      )}

      <DataTable
        data={products}
        categories={categories}
        searchFields={["name", "slug"]}
        labelKey="name"
        renderTable={(items) => (
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-3 text-left font-semibold text-gray-600">Name</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600">Category</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600">Price</th>
                  <th className="px-6 py-3 text-right font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{p.name}</div>
                      <div className="text-xs text-gray-400 font-mono mt-0.5">{p.slug}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{p.category?.name || p.categoryId}</td>
                    <td className="px-6 py-4 text-gray-500">{p.price}</td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/products?edit=${p.id}`} className="rounded-lg px-3 py-1.5 text-xs font-medium text-violet-600 hover:bg-violet-50 transition-colors">Edit</Link>
                      <form action={deleteProd} className="inline ml-1">
                        <input type="hidden" name="id" value={p.id} />
                        <DeleteButton label="Delete" confirmMsg="Delete?" />
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      />
    </div>
  )
}

function safeParseArray(val: string): string[] {
  try { const p = JSON.parse(val); return Array.isArray(p) ? p : [] } catch { return [] }
}
function safeParsePairs(val: string): [string, string][] {
  try {
    const p = JSON.parse(val)
    if (typeof p === "object" && !Array.isArray(p)) return Object.entries(p)
    return Array.isArray(p) ? p : []
  } catch { return [] }
}

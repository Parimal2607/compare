import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import ProductForm, { ProductFormData } from "@/components/admin/ProductForm"
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
        slugKey="slug"
        columns={[
          { key: "name", label: "Name" },
          { key: "category", label: "Category" },
          { key: "price", label: "Price" },
        ]}
        editUrlPrefix="/admin/products?edit="
        onDelete={deleteProd}
        deleteConfirmMsg="Delete?"
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

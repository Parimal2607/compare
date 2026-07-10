import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
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

export default async function AdminProducts() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ orderBy: { name: "asc" }, include: { category: true } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ])

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Link href="/admin/products/new"
          className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all">
          + Add Product
        </Link>
      </div>

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
        editUrlPrefix="/admin/products/"
        onDelete={deleteProd}
        deleteConfirmMsg="Delete?"
      />
    </div>
  )
}

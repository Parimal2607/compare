import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import Link from "next/link"
import DataTable from "@/components/admin/DataTable"
import DeleteAllButton from "@/components/admin/DeleteAllButton"

async function deleteComp(formData: FormData) {
  "use server"
  const id = formData.get("id") as string
  await prisma.comparison.delete({ where: { id } })
  revalidatePath("/admin/comparisons")
  revalidatePath("/")
}

async function deleteAll() {
  "use server"
  await prisma.comparison.deleteMany()
  revalidatePath("/admin/comparisons")
  revalidatePath("/admin/products")
  revalidatePath("/admin/categories")
  revalidatePath("/", "layout")
}

export default async function AdminComparisons() {
  const [comparisons, categories, products] = await Promise.all([
    prisma.comparison.findMany({ orderBy: { title: "asc" }, include: { category: true } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({ orderBy: { name: "asc" } }),
  ])

  const rows = comparisons.map((c) => {
    const pA = products.find((p) => p.id === c.productAId)
    const pB = products.find((p) => p.id === c.productBId)
    return {
      ...c,
      productsLabel: `${pA?.name || c.productAId}  vs  ${pB?.name || c.productBId}`,
    }
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Comparisons</h1>
        <div className="flex items-center gap-3">
          <form action={deleteAll}>
            <DeleteAllButton confirmMsg="Delete ALL comparisons? This cannot be undone." />
          </form>
          <Link href="/admin/comparisons/new"
            className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 transition-all">
            + Add Comparison
          </Link>
        </div>
      </div>

      <DataTable
        data={rows}
        categories={categories}
        searchFields={["title", "slug", "productsLabel"]}
        labelKey="title"
        slugKey="slug"
        columns={[
          { key: "title", label: "Title" },
          { key: "category", label: "Category" },
          { key: "productsLabel", label: "Products" },
        ]}
        editUrlPrefix="/admin/comparisons/"
        onDelete={deleteComp}
        deleteConfirmMsg="Delete this comparison?"
      />
    </div>
  )
}

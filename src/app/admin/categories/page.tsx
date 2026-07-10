import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { EditCategoryModal } from "@/components/admin/EditCategoryModal"
import { DeleteButton } from "@/components/admin/DeleteButton"
import DeleteAllButton from "@/components/admin/DeleteAllButton"

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

async function create(formData: FormData) {
  "use server"
  const name = (formData.get("name") as string).trim()
  const slug = slugify(name)
  const id = slug
  await prisma.category.upsert({ where: { id }, update: { name, slug }, create: { id, name, slug } })
  revalidatePath("/admin/categories")
  revalidatePath("/")
  revalidatePath("/categories")
}

async function update(formData: FormData) {
  "use server"
  const id = formData.get("id") as string
  const name = (formData.get("name") as string).trim()
  const slug = (formData.get("slug") as string).trim()
  await prisma.category.update({ where: { id }, data: { name, slug } })
  revalidatePath("/admin/categories")
  revalidatePath("/")
  revalidatePath("/categories")
}

async function deleteCat(formData: FormData) {
  "use server"
  const id = formData.get("id") as string
  await prisma.comparison.deleteMany({ where: { categoryId: id } })
  await prisma.product.deleteMany({ where: { categoryId: id } })
  await prisma.category.delete({ where: { id } })
  revalidatePath("/admin/categories")
  revalidatePath("/")
  revalidatePath("/categories")
}

async function deleteAll() {
  "use server"
  await prisma.comparison.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  revalidatePath("/admin/categories")
  revalidatePath("/")
  revalidatePath("/categories")
}

export default async function AdminCategories() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <form action={deleteAll}>
          <DeleteAllButton confirmMsg="Delete ALL categories, products, and comparisons? This cannot be undone." disabled={categories.length === 0} />
        </form>
      </div>

      <div className="mb-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Add Category</h2>
        <form action={create} className="flex gap-3">
          <input name="name" placeholder="Category name" required
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
          <button type="submit" className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all">
            Add
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-6 py-3 text-left font-semibold text-gray-600">ID</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-600">Name</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-600">Slug</th>
              <th className="px-6 py-3 text-right font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-gray-50 last:border-0">
                <td className="px-6 py-4 text-gray-400 font-mono text-xs">{cat.id}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{cat.name}</td>
                <td className="px-6 py-4 text-gray-500">{cat.slug}</td>
                <td className="px-6 py-4 text-right">
                  <EditCategoryModal id={cat.id} name={cat.name} slug={cat.slug} action={update} />
                  <form action={deleteCat} className="inline ml-2">
                    <input type="hidden" name="id" value={cat.id} />
                    <DeleteButton label="Delete" confirmMsg="Delete this category and all its products/comparisons?" />
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && <p className="px-6 py-10 text-center text-sm text-gray-400">No categories yet.</p>}
      </div>
    </div>
  )
}

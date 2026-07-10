import { prisma } from "@/lib/prisma"
import ComparisonForm from "@/components/admin/ComparisonForm"
import Link from "next/link"

export default async function NewComparison() {
  const [categories, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({ orderBy: { name: "asc" } }),
  ])

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">New Comparison</h1>
        <Link href="/admin/comparisons"
          className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
          ← Back
        </Link>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <ComparisonForm
          categories={categories.map((c) => ({ id: c.id, name: c.name }))}
          products={products.map((p) => ({ id: p.id, name: p.name, categoryId: p.categoryId }))}
          comparison={undefined}
          action="create"
        />
      </div>
    </div>
  )
}

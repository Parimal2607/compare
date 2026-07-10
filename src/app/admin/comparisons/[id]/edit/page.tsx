import { prisma } from "@/lib/prisma"
import ComparisonForm, { ComparisonFormData } from "@/components/admin/ComparisonForm"
import Link from "next/link"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditComparison({ params }: Props) {
  const { id } = await params
  const [comparison, categories, products] = await Promise.all([
    prisma.comparison.findUnique({ where: { id }, include: { category: true } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({ orderBy: { name: "asc" } }),
  ])
  if (!comparison) notFound()

  function safeArr(val: string): string[] {
    try { const p = JSON.parse(val); return Array.isArray(p) ? p : [] } catch { return [] }
  }

  const formData: ComparisonFormData = {
    id: comparison.id, title: comparison.title, slug: comparison.slug,
    description: comparison.description, categoryId: comparison.categoryId,
    productAId: comparison.productAId, productBId: comparison.productBId,
    summary: comparison.summary, verdict: comparison.verdict,
    winnerIndex: comparison.winnerIndex,
    prosA: safeArr(comparison.prosPerProductA), consA: safeArr(comparison.consPerProductA),
    prosB: safeArr(comparison.prosPerProductB), consB: safeArr(comparison.consPerProductB),
    heroImage: comparison.heroImage || "",
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Comparison</h1>
        <Link href="/admin/comparisons"
          className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
          ← Back
        </Link>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <ComparisonForm
          categories={categories.map((c) => ({ id: c.id, name: c.name }))}
          products={products.map((p) => ({ id: p.id, name: p.name, categoryId: p.categoryId }))}
          comparison={formData}
          action="update"
        />
      </div>
    </div>
  )
}

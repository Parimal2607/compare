import { prisma } from "@/lib/prisma"
import ImportTool from "@/components/admin/ImportTool"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function ImportPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } })
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Import Product</h1>
          <p className="text-sm text-gray-500 mt-1">Paste a product URL to extract data automatically</p>
        </div>
        <Link href="/admin/products"
          className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
          ← Products
        </Link>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <ImportTool categories={categories.map((c) => ({ id: c.id, name: c.name }))} />
      </div>
    </div>
  )
}

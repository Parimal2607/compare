import { prisma } from "@/lib/prisma"
import ProductForm, { ProductFormData } from "@/components/admin/ProductForm"
import Link from "next/link"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditProduct({ params }: Props) {
  const { id } = await params
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id }, include: { category: true } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ])
  if (!product) notFound()

  const formData: ProductFormData = {
    id: product.id, name: product.name, slug: product.slug,
    image: product.image, heroImage: product.heroImage || "",
    description: product.description, price: product.price, rating: product.rating,
    categoryId: product.categoryId,
    specs: safeParsePairs(product.specs), pros: safeParseArray(product.pros), cons: safeParseArray(product.cons),
    affiliateLink: product.affiliateLink || "",
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <Link href="/admin/products"
          className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
          ← Back
        </Link>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <ProductForm categories={categories.map((c) => ({ id: c.id, name: c.name }))} product={formData} action="update" />
      </div>
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

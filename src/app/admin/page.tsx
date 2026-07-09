import Link from "next/link"
import { prisma } from "@/lib/prisma"

export default async function AdminDashboard() {
  const [catCount, prodCount, compCount] = await Promise.all([
    prisma.category.count(),
    prisma.product.count(),
    prisma.comparison.count(),
  ])

  const stats = [
    { label: "Categories", value: catCount, href: "/admin/categories", color: "from-violet-500 to-purple-600" },
    { label: "Products", value: prodCount, href: "/admin/products", color: "from-blue-500 to-cyan-600" },
    { label: "Comparisons", value: compCount, href: "/admin/comparisons", color: "from-emerald-500 to-teal-600" },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>
      <div className="grid gap-6 sm:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="group block rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
            <div className={`mb-3 h-2 w-12 rounded-full bg-gradient-to-r ${s.color}`} />
            <div className="text-3xl font-bold text-gray-900">{s.value}</div>
            <div className="mt-1 text-sm text-gray-500">{s.label}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

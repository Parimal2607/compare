import { prisma } from "@/lib/prisma"
import Link from "next/link"
import CopyButton from "./CopyButton"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || `https://${process.env.VERCEL_URL}` || "http://localhost:3000"

export default async function ScrapedUrlsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" }, include: { category: true } })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scraped URLs</h1>
          <p className="text-sm text-gray-500 mt-1">All imported products with their public URLs — click to copy</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-6 py-3 text-left font-semibold text-gray-600">Product</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-600">Category</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-600">Public URL</th>
              <th className="px-6 py-3 text-right font-semibold text-gray-600">Copy</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const url = `${SITE_URL.replace(/\/+$/, "")}/products/${p.slug}`
              return (
                <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{p.name}</div>
                    <div className="text-xs text-gray-400 font-mono mt-0.5">{p.slug}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{p.category.name}</td>
                  <td className="px-6 py-4">
                    <Link href={url} target="_blank" className="text-violet-600 hover:text-violet-700 underline underline-offset-2 font-mono text-xs break-all">
                      {url}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <CopyButton url={url} />
                  </td>
                </tr>
              )
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-400">No products imported yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

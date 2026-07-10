import { prisma } from "@/lib/prisma"
import ScrapedUrlsTable from "./ScrapedUrlsTable"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

export default async function ScrapedUrlsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" }, include: { category: true } })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scraped URLs</h1>
          <p className="text-sm text-gray-500 mt-1">All imported products with their public URLs</p>
        </div>
      </div>

      <ScrapedUrlsTable products={products} siteUrl={SITE_URL} />
    </div>
  )
}

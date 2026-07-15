import type { MetadataRoute } from "next"
import { prisma } from "@/lib/prisma"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || `https://${process.env.VERCEL_URL}` || "http://localhost:3000").replace(/\/+$/, "")

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
    { url: `${baseUrl}/categories`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/games`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${baseUrl}/games/spin-wheel`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${baseUrl}/games/tic-tac-toe`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
  ]

  try {
    const [products, comparisons, newsArticles] = await Promise.all([
      prisma.product.findMany({ select: { slug: true, updatedAt: true }, take: 50000 }),
      prisma.comparison.findMany({ select: { slug: true, updatedAt: true }, take: 50000 }),
      prisma.newsArticle.findMany({ select: { slug: true, published: true }, take: 50000 }),
    ])

    return [
      ...staticPages,
      ...products.map((p) => ({
        url: `${baseUrl}/products/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
      ...comparisons.map((c) => ({
        url: `${baseUrl}/compare/${c.slug}`,
        lastModified: c.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      ...newsArticles.map((n) => ({
        url: `${baseUrl}/news/${n.slug}`,
        lastModified: n.published,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      })),
    ]
  } catch {
    return staticPages
  }
}

import RssParser from "rss-parser"
import { prisma } from "./prisma"

export interface NewsArticle {
  slug: string
  title: string
  excerpt: string
  content: string
  image: string
  source: string
  sourceUrl: string
  author: string
  published: string
  categories: string[]
}

const FEEDS: { url: string; name: string }[] = [
  { url: "https://techcrunch.com/feed/", name: "TechCrunch" },
  { url: "https://www.theverge.com/rss/index.xml", name: "The Verge" },
  { url: "https://feeds.feedburner.com/wired/index", name: "Wired" },
  { url: "https://www.engadget.com/rss.xml", name: "Engadget" },
  { url: "https://www.zdnet.com/news/rss.xml", name: "ZDNet" },
  { url: "https://feeds.arstechnica.com/arstechnica/index", name: "Ars Technica" },
]

const parser = new RssParser({
  timeout: 10000,
  headers: { "User-Agent": "CompareHub/1.0" },
})

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100)
}

function shortHash(s: string): string {
  let hash = 0
  for (let i = 0; i < s.length; i++) {
    const char = s.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36).slice(0, 5)
}

function extractImage(item: any): string {
  if (item.enclosure?.url && /\.(jpg|jpeg|png|gif|webp)/i.test(item.enclosure.url)) return item.enclosure.url
  if (item["media:content"]?.$.url) return item["media:content"].$.url
  if (item["media:thumbnail"]?.$.url) return item["media:thumbnail"].$.url
  const match = (item.content || item.contentSnippet || "").match(/<img[^>]+src=["']([^"']+)["']/)
  return match ? match[1] : ""
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim()
}

export async function fetchAndStoreNews(): Promise<NewsArticle[]> {
  const all: NewsArticle[] = []
  const seen = new Set<string>()

  const results = await Promise.allSettled(
    FEEDS.map(async (feed) => {
      const parsed = await parser.parseURL(feed.url)
      return parsed.items?.map((item: any) => {
        const title = item.title?.trim() || "Untitled"
        const slug = slugify(title) + "-" + shortHash(item.link || feed.name)
        const content = item.content || item.contentSnippet || item.summary || ""
        const excerpt = stripHtml(content).slice(0, 250).replace(/\s+\S*$/, "") + (content.length > 250 ? "…" : "")
        const image = extractImage(item)
        const author =
          (item.creator || item.author || "").replace(/\(.*?\)/g, "").trim() || feed.name
        const published = item.pubDate || item.isoDate || item.date || new Date().toISOString()
        const categories = (item.categories || []).map((c: any) => (typeof c === "string" ? c : c.$?.term || ""))
          .filter(Boolean) as string[]

        return {
          slug,
          title,
          excerpt,
          content: stripHtml(content),
          image,
          source: feed.name,
          sourceUrl: item.link || "",
          author,
          published: new Date(published).toISOString(),
          categories,
        } satisfies NewsArticle
      }) || []
    })
  )

  for (const result of results) {
    if (result.status !== "fulfilled") continue
    for (const article of result.value) {
      const key = article.sourceUrl || article.title
      if (!seen.has(key)) {
        seen.add(key)
        all.push(article)
      }
    }
  }

  all.sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime())
  const top = all.slice(0, 50)

  // Persist to DB
  for (const article of top) {
    try {
      await prisma.newsArticle.upsert({
        where: { slug: article.slug },
        update: {
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          image: article.image || null,
          source: article.source,
          sourceUrl: article.sourceUrl,
          author: article.author || null,
          published: new Date(article.published),
        },
        create: {
          id: article.slug,
          slug: article.slug,
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          image: article.image || null,
          source: article.source,
          sourceUrl: article.sourceUrl,
          author: article.author || null,
          published: new Date(article.published),
        },
      })
    } catch {
      // skip duplicates
    }
  }

  return top
}

export async function getNewsFromDb(): Promise<NewsArticle[]> {
  const rows = await prisma.newsArticle.findMany({
    orderBy: { published: "desc" },
    take: 50,
  })
  return rows.map((r) => ({
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    content: r.content,
    image: r.image || "",
    source: r.source,
    sourceUrl: r.sourceUrl,
    author: r.author || "",
    published: r.published.toISOString(),
    categories: [],
  }))
}
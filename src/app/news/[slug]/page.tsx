import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import type { NewsArticle } from "@/lib/news"
import { getCachedNews } from "@/lib/get-cached-news"
import { getNewsFromDb } from "@/lib/news"
import { newsArticleSchema } from "@/lib/schema"
import { siteUrl } from "@/lib/site-url"

interface Props {
  params: Promise<{ slug: string }>
}

async function lookupArticle(slug: string): Promise<NewsArticle | null> {
  let articles: NewsArticle[] = []
  try { articles = await getCachedNews() } catch {}
  let article = articles.find((a) => a.slug === slug)
  if (!article) {
    articles = await getNewsFromDb()
    article = articles.find((a) => a.slug === slug)
  }
  return article || null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await lookupArticle(slug)
  if (!article) return {}
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.published,
      authors: article.author ? [article.author] : [],
      images: article.image ? [{ url: article.image }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: article.image ? [article.image] : [],
    },
  }
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params
  const article = await lookupArticle(slug)
  if (!article) notFound()

  const schema = newsArticleSchema({
    title: article.title,
    description: article.excerpt,
    image: article.image,
    url: `${siteUrl()}/news/${article.slug}`,
    published: article.published,
    author: article.author,
    source: article.source,
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link href="/" className="text-sm text-violet-600 hover:text-violet-800 mb-6 inline-block">
          ← Back to home
        </Link>

        <article>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-3 uppercase tracking-wider">
            <span>{article.source}</span>
            <span>·</span>
            <span>{new Date(article.published).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
            {article.author && (
              <>
                <span>·</span>
                <span>{article.author}</span>
              </>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-4">
            {article.title}
          </h1>

          {article.image && (
            <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 mb-6">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <p className="text-lg text-gray-600 leading-relaxed mb-6">{article.excerpt}</p>

          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
            {article.content}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-violet-600 hover:text-violet-800 underline"
            >
              Read original article on {article.source} →
            </a>
          </div>
        </article>
      </div>
    </>
  )
}
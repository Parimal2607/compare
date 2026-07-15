import { getComparisonBySlugWithProducts, getComparisons } from "@/data/comparisons"
import CompareContent from "./CompareContent"
import PageWithSidebar from "@/components/PageWithSidebar"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { productSchema, breadcrumbSchema, comparisonSchema } from "@/lib/schema"

interface Props {
  params: Promise<{ slug: string }>
}

export const revalidate = 60

export async function generateStaticParams() {
  const comparisons = await getComparisons()
  return comparisons.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const result = await getComparisonBySlugWithProducts(slug)
  if (!result) return {}
  return {
    title: result.comparison.title,
    description: result.comparison.description,
    openGraph: {
      title: result.comparison.title,
      description: result.comparison.description,
      type: "website",
      images: result.productA?.image ? [{ url: result.productA.image }] : [],
    },
    alternates: { canonical: `/compare/${result.comparison.slug}` },
  }
}

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || `https://${process.env.VERCEL_URL}` || "http://localhost:3000").replace(/\/+$/, "")
}

export default async function ComparePage({ params }: Props) {
  const { slug } = await params
  const result = await getComparisonBySlugWithProducts(slug)
  if (!result) notFound()

  const baseUrl = siteUrl()
  const productSchemas = [result.productA, result.productB]
    .filter(Boolean)
    .map((p) => productSchema(p!))

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: `${baseUrl}/` },
    { name: "Comparisons", url: `${baseUrl}/categories` },
    { name: result.comparison.title, url: `${baseUrl}/compare/${result.comparison.slug}` },
  ])

  const compSchema = result.productA && result.productB ? comparisonSchema({
    title: result.comparison.title,
    description: result.comparison.description,
    url: `${baseUrl}/compare/${result.comparison.slug}`,
    productA: { name: result.productA.name, url: `${baseUrl}/products/${result.productA.slug}` },
    productB: { name: result.productB.name, url: `${baseUrl}/products/${result.productB.slug}` },
  }) : null

  return (
    <PageWithSidebar>
      {productSchemas.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      {compSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(compSchema) }}
        />
      )}
      <CompareContent comparison={result.comparison} productA={result.productA} productB={result.productB} />
    </PageWithSidebar>
  )
}
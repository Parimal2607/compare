import { getComparisonBySlugWithProducts, getComparisons } from "@/data/comparisons"
import CompareContent from "./CompareContent"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { productSchema } from "@/lib/schema"

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
  }
}

export default async function ComparePage({ params }: Props) {
  const { slug } = await params
  const result = await getComparisonBySlugWithProducts(slug)
  if (!result) notFound()

  const schemas = [result.productA, result.productB]
    .filter(Boolean)
    .map((p) => productSchema(p!))

  return (
    <>
      {schemas.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
      <CompareContent comparison={result.comparison} productA={result.productA} productB={result.productB} />
    </>
  )
}
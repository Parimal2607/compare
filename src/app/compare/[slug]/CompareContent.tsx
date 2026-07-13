"use client"

import Link from "next/link"
import { Comparison, Product } from "@/data/types"
import ComparisonTable from "@/components/ComparisonTable"
import ProsCons from "@/components/ProsCons"

export default function CompareContent({
  comparison,
  productA,
  productB,
}: {
  comparison: Comparison
  productA: Product | null
  productB: Product | null
}) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="transition-colors hover:text-violet-600">Home</Link>
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <Link href="/categories" className="transition-colors hover:text-violet-600">{comparison.category}</Link>
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-900">Comparison</span>
      </nav>

      <div className="mb-10">
          <span className="inline-flex items-center rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700 mb-3">
            {comparison.category}
          </span>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">{comparison.title}</h1>
        <p className="mt-4 text-lg text-gray-500 max-w-3xl">{comparison.description}</p>
      </div>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Specifications Comparison</h2>
        <ComparisonTable comparison={comparison} productA={productA} productB={productB} />
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Pros & Cons</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <ProsCons
              pros={comparison.prosPerProduct[0]}
              cons={comparison.consPerProduct[0]}
              label={productA?.name || comparison.productAId}
              winner={comparison.winnerIndex === 0}
            />
          </div>
          <div>
            <ProsCons
              pros={comparison.prosPerProduct[1]}
              cons={comparison.consPerProduct[1]}
              label={productB?.name || comparison.productBId}
              winner={comparison.winnerIndex === 1}
            />
          </div>
        </div>
      </section>

      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm sm:p-10">
        <h2 className="text-2xl font-bold text-gray-900">Summary</h2>
        <p className="mt-4 text-base text-gray-600 leading-relaxed">{comparison.summary}</p>
        <div className="my-8 border-t border-gray-100" />
        <h3 className="text-xl font-bold text-gray-900">Verdict</h3>
        <p className="mt-4 text-base text-gray-600 leading-relaxed">{comparison.verdict}</p>
        <div className="mt-8 flex flex-wrap gap-4">
          {productA && (
            <Link
              href={`/products/${productA.slug}`}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-violet-600 px-6 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-violet-700 hover:shadow-md active:scale-[0.98]"
            >
              View {productA.name} Details
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          )}
          {productB && (
            <Link
              href={`/products/${productB.slug}`}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
            >
              View {productB.name} Details
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

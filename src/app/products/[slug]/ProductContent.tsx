"use client"

import Link from "next/link"
import SafeImage from "@/components/SafeImage"
import type { Product } from "@/data/types"
import type { ReactNode } from "react"

export default function ProductContent({
  product,
  relatedComparisons,
}: {
  product: Product
  relatedComparisons: ReactNode
}) {
  return (
    <div className="mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="transition-colors hover:text-violet-600">Home</Link>
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="mb-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="relative h-56 overflow-hidden sm:h-64">
          <SafeImage
            src={product.heroImage || product.image}
            alt={product.name}
            fill
            className="object-contain"
            priority
            sizes="(max-width: 768px) 100vw, 800px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
        </div>
        <div className="relative -mt-16 px-6 pb-6 sm:px-8 sm:pb-8">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-gray-200 bg-white text-3xl font-bold text-violet-600 shadow-lg">
            {product.name.charAt(0)}
          </div>
          <span className="inline-flex items-center rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700 mb-3">
            {product.category}
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{product.name}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <span className="text-3xl font-bold text-gray-900">{product.price}</span>
            {product.rating != null && product.rating > 0 && (
              <span className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-600">
                {product.rating}
                <svg className="h-4 w-4 fill-amber-400" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </span>
            )}
          </div>
          <p className="mt-4 text-lg text-gray-500 leading-relaxed">{product.description}</p>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Specifications</h2>
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <tbody>
              {Object.entries(product.specs).map(([key, value], i) => (
                <tr key={key} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="w-1/3 border-r border-gray-100 p-4 font-medium text-gray-700">{key}</td>
                  <td className="p-4 text-gray-600">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Pros & Cons</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Pros
            </h3>
            <ul className="space-y-3">
              {product.pros.map((pro, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-600">
                    {i + 1}
                  </span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-red-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-red-700">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cons
            </h3>
            <ul className="space-y-3">
              {product.cons.map((con, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-600">
                    {i + 1}
                  </span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {relatedComparisons}
    </div>
  )
}

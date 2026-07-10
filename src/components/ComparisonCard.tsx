import Link from "next/link"
import Image from "next/image"
import type { Comparison, Product } from "@/data/types"

const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' fill='%23f3f4f6'%3E%3Crect width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' fill='%239ca3af' font-family='sans-serif' font-size='18' text-anchor='middle' dy='.3em'%3ECompare%3C/text%3E%3C/svg%3E"

export default function ComparisonCard({
  comparison,
  productA,
  productB,
}: {
  comparison: Comparison
  productA?: Product | null
  productB?: Product | null
}) {
  return (
    <Link
      href={`/compare/${comparison.slug}`}
      className="group relative block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-100/50"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 to-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10" />
      <div className="relative h-40 overflow-hidden bg-gray-100">
        <div className="absolute inset-0 flex">
          <div className="relative w-1/2 overflow-hidden">
            <Image
              src={productA?.heroImage || productA?.image || PLACEHOLDER_IMAGE}
              alt={productA?.name || comparison.productAId}
              fill
              className="object-contain transition-all duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 15vw"
            />
          </div>
          <div className="relative w-1/2 overflow-hidden border-l border-white/10">
            <Image
              src={productB?.heroImage || productB?.image || PLACEHOLDER_IMAGE}
              alt={productB?.name || comparison.productBId}
              fill
              className="object-contain transition-all duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 15vw"
            />
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-blue-500 text-xs font-bold text-white shadow-lg shadow-violet-500/30 ring-4 ring-white/90">
            VS
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 z-10">
          <span className="rounded-lg bg-white/90 px-2.5 py-1 text-xs font-semibold text-gray-800 backdrop-blur-sm shadow-sm">
            {productA?.name || comparison.productAId}
          </span>
          <span className="text-xs font-bold text-white/80">VS</span>
          <span className="rounded-lg bg-white/90 px-2.5 py-1 text-xs font-semibold text-gray-800 backdrop-blur-sm shadow-sm">
            {productB?.name || comparison.productBId}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-sm font-semibold text-gray-900 transition-colors duration-300 group-hover:text-violet-600 line-clamp-1">
          {comparison.title}
        </h3>
        <p className="mt-1.5 text-sm text-gray-500 line-clamp-2">{comparison.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-700">
            {comparison.category}
          </span>
          <span className="text-xs font-medium text-violet-600 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-1">
            Compare →
          </span>
        </div>
      </div>
    </Link>
  )
}

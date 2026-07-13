import Link from "next/link"
import SafeImage from "@/components/SafeImage"
import type { Comparison, Product } from "@/data/types"

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
      className="group relative block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm shadow-gray-200/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-200/80"
    >
      <div className="relative h-40 overflow-hidden bg-gray-100">
        <div className="absolute inset-0 flex">
          <div className="relative w-1/2 overflow-hidden">
            <SafeImage
              src={productA?.heroImage || productA?.image || ""}
              alt={productA?.name || "Product A"}
              fill
              className="object-contain transition-all duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 15vw"
            />
          </div>
          <div className="relative w-1/2 overflow-hidden border-l border-gray-200">
            <SafeImage
              src={productB?.heroImage || productB?.image || ""}
              alt={productB?.name || "Product B"}
              fill
              className="object-contain transition-all duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 15vw"
            />
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xs font-bold text-gray-900 shadow-lg ring-4 ring-white/90">
            VS
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2">
          <span className="rounded-lg bg-white/90 px-2.5 py-1 text-xs font-semibold text-gray-800 shadow-sm">
            {productA?.name || "Product A"}
          </span>
          <span className="text-xs font-bold text-white/70">VS</span>
          <span className="rounded-lg bg-white/90 px-2.5 py-1 text-xs font-semibold text-gray-800 shadow-sm">
            {productB?.name || "Product B"}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-sm font-semibold text-gray-900 transition-colors duration-300 group-hover:text-violet-600 line-clamp-1">
          {comparison.title}
        </h3>
        <p className="mt-1.5 text-sm text-gray-500 line-clamp-2">{comparison.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="inline-flex items-center rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-700">
            {comparison.category}
          </span>
          <span className="text-xs font-medium text-violet-600 opacity-0 transition-all duration-300 group-hover:opacity-100">
            Compare →
          </span>
        </div>
      </div>
    </Link>
  )
}
"use client"

import type { Comparison, Product } from "@/data/types"
import { useState } from "react"

export default function ComparisonTable({
  comparison,
  productA,
  productB,
}: {
  comparison: Comparison
  productA: Product | null
  productB: Product | null
}) {
  const [activeTab, setActiveTab] = useState<0 | 1>(comparison.winnerIndex)

  if (!productA || !productB) return null

  const allSpecKeys = [...new Set([...Object.keys(productA.specs), ...Object.keys(productB.specs)])]

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm shadow-gray-200/50">
      <div className="grid grid-cols-3 border-b border-gray-100">
        <div className="p-4 text-sm font-medium text-gray-500">Specification</div>
        <button
          onClick={() => setActiveTab(0)}
          className={`p-4 text-center text-sm font-semibold transition-all duration-200 ${
            activeTab === 0
              ? "bg-gradient-to-r from-violet-50 to-blue-50 text-violet-700"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          {productA.name}
          {comparison.winnerIndex === 0 && (
            <span className="ml-1.5 inline-flex items-center gap-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
              WINNER
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab(1)}
          className={`p-4 text-center text-sm font-semibold transition-all duration-200 ${
            activeTab === 1
              ? "bg-gradient-to-r from-violet-50 to-blue-50 text-violet-700"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          {productB.name}
          {comparison.winnerIndex === 1 && (
            <span className="ml-1.5 inline-flex items-center gap-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
              WINNER
            </span>
          )}
        </button>
      </div>
      <div className="grid grid-cols-3">
        <div className="border-r border-gray-50 bg-gray-50/50 p-4 text-sm font-medium text-gray-700">Price</div>
        <div
          className={`border-r border-gray-50 p-4 text-center text-sm ${
            activeTab === 0 ? "bg-gradient-to-r from-violet-50/50 to-blue-50/50" : ""
          }`}
        >
          <span className="font-semibold text-gray-900">{productA.price}</span>
        </div>
        <div
          className={`p-4 text-center text-sm ${
            activeTab === 1 ? "bg-gradient-to-r from-violet-50/50 to-blue-50/50" : ""
          }`}
        >
          <span className="font-semibold text-gray-900">{productB.price}</span>
        </div>
      </div>
      {allSpecKeys.map((key) => (
        <div key={key} className="grid grid-cols-3 border-t border-gray-50">
          <div className="border-r border-gray-50 bg-gray-50/50 p-4 text-sm font-medium text-gray-700">{key}</div>
          <div
            className={`border-r border-gray-50 p-4 text-center text-sm text-gray-600 ${
              activeTab === 0 ? "bg-gradient-to-r from-violet-50/50 to-blue-50/50" : ""
            }`}
          >
            {productA.specs[key] || "-"}
          </div>
          <div
            className={`p-4 text-center text-sm text-gray-600 ${
              activeTab === 1 ? "bg-gradient-to-r from-violet-50/50 to-blue-50/50" : ""
            }`}
          >
            {productB.specs[key] || "-"}
          </div>
        </div>
      ))}
    </div>
  )
}

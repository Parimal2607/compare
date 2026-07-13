"use client"

import { useState, useRef, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const COLORS = [
  "#8b5cf6", "#06b6d4", "#ef4444", "#f59e0b", "#10b981", "#3b82f6",
  "#ec4899", "#14b8a6", "#f97316", "#6366f1",
]

export default function SpinWheelClient({ products }: { products: { name: string; slug: string }[] }) {
  const router = useRouter()
  const [selected, setSelected] = useState<typeof products>([])
  const [search, setSearch] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [result, setResult] = useState<{ name: string; slug: string } | null>(null)

  const options = selected.length >= 2 ? selected : products.slice(0, 6)
  const segmentAngle = 360 / options.length

  const filtered = useMemo(() => {
    if (!search.trim()) return []
    const q = search.toLowerCase()
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) && !selected.find((s) => s.slug === p.slug)
    )
  }, [products, selected, search])

  function addProduct(product: typeof products[0]) {
    if (!selected.find((s) => s.slug === product.slug)) {
      setSelected([...selected, product])
    }
    setSearch("")
    setShowDropdown(false)
  }

  function removeProduct(slug: string) {
    setSelected(selected.filter((s) => s.slug !== slug))
  }

  function resetToDefaults() {
    setSelected([])
    setResult(null)
  }

  function spin() {
    if (spinning) return
    setSpinning(true)
    setResult(null)

    const extraSpins = 5 + Math.floor(Math.random() * 5)
    const randomStop = Math.random() * 360
    const totalRotation = rotation + extraSpins * 360 + randomStop
    setRotation(totalRotation)

    setTimeout(() => {
      const normalized = totalRotation % 360
      const winningIndex = Math.floor(normalized / segmentAngle)
      setResult(options[winningIndex])
      setSpinning(false)
    }, 4000)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link href="/games" className="text-sm text-violet-600 hover:text-violet-700">&larr; Back to Games</Link>
      </div>

      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Phone Spin the Wheel</h1>
        <p className="mt-2 text-gray-500 max-w-lg mx-auto">
          Search for phones to add to the wheel, then spin to let fate decide!
        </p>
      </div>

      <div className="mt-8 relative max-w-md mx-auto">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setShowDropdown(true); setResult(null) }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          placeholder="Search phones to add to the wheel..."
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400 transition-colors"
        />
        {showDropdown && filtered.length > 0 && (
          <div className="absolute z-20 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg max-h-48 overflow-y-auto">
            {filtered.map((p) => (
              <button
                key={p.slug}
                onMouseDown={() => addProduct(p)}
                className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition-colors"
              >
                {p.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {selected.length > 0 && (
        <div className="mt-4 max-w-md mx-auto">
          <div className="flex flex-wrap gap-2">
            {selected.map((p) => (
              <span key={p.slug} className="inline-flex items-center gap-1 rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700">
                {p.name}
                <button onClick={() => removeProduct(p.slug)} className="text-violet-400 hover:text-violet-600">&times;</button>
              </span>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <button onClick={resetToDefaults} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              Reset to defaults
            </button>
            <span className="text-xs text-gray-400">{options.length} phone{options.length !== 1 ? "s" : ""} on wheel</span>
          </div>
        </div>
      )}

      {options.length < 2 && (
        <p className="mt-2 text-xs text-amber-600 text-center">Add at least 2 phones to spin!</p>
      )}

      <div className="relative mt-10 mx-auto w-72 h-72 sm:w-80 sm:h-80">
        <div className={`absolute -top-6 left-1/2 -translate-x-1/2 z-10 text-3xl ${spinning ? "animate-bounce" : ""}`}>👇</div>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-xl"
          style={{ transform: `rotate(${rotation}deg)`, transition: spinning ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none" }}
        >
          {options.map((p, i) => {
            const startAngle = i * segmentAngle - 90
            const endAngle = (i + 1) * segmentAngle - 90
            const startRad = (startAngle * Math.PI) / 180
            const endRad = (endAngle * Math.PI) / 180
            const x1 = 50 + 50 * Math.cos(startRad)
            const y1 = 50 + 50 * Math.sin(startRad)
            const x2 = 50 + 50 * Math.cos(endRad)
            const y2 = 50 + 50 * Math.sin(endRad)
            const midAngle = ((startAngle + endAngle) / 2 * Math.PI) / 180
            const lx = 50 + 35 * Math.cos(midAngle)
            const ly = 50 + 35 * Math.sin(midAngle)
            const short = p.name.length > 12 ? p.name.slice(0, 11) + "…" : p.name
            return (
              <g key={p.slug}>
                <path d={`M50,50 L${x1},${y1} A50,50 0 0,1 ${x2},${y2} Z`} fill={COLORS[i % COLORS.length]} stroke="white" strokeWidth="0.5" />
                <text
                  x={lx} y={ly}
                  textAnchor="middle" dominantBaseline="central"
                  fill="white" fontSize={options.length > 8 ? "2.5" : "3"} fontWeight="bold"
                  transform={`rotate(${(startAngle + endAngle) / 2}, ${lx}, ${ly})`}
                >
                  {short}
                </text>
              </g>
            )
          })}
          <circle cx="50" cy="50" r="8" fill="white" stroke="#e5e7eb" strokeWidth="2" />
        </svg>
      </div>

      <div className="text-center mt-10">
        <button
          onClick={spin}
          disabled={spinning || options.length < 2}
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
        >
          {spinning ? "Spinning..." : "Spin the Wheel!"}
        </button>
      </div>

      {result && (
        <div className="mt-8 rounded-2xl border border-violet-100 bg-violet-50 p-6 text-center animate-fade-in">
          <div className="text-4xl mb-2">📱</div>
          <p className="text-lg font-semibold text-violet-900">
            You got: <span className="text-violet-700">{result.name}</span>
          </p>
          <p className="mt-1 text-sm text-violet-600">Let&apos;s check it out!</p>
          <div className="mt-4 flex justify-center gap-3">
            <Link
              href={`/products/${result.slug}`}
              className="inline-flex items-center gap-1 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-violet-700 shadow-sm hover:shadow-md transition-all"
            >
              View Details &rarr;
            </Link>
            <button
              onClick={spin}
              className="rounded-lg border border-violet-200 px-5 py-2.5 text-sm font-medium text-violet-600 hover:bg-violet-100 transition-all"
            >
              Spin Again
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
      `}</style>
    </div>
  )
}

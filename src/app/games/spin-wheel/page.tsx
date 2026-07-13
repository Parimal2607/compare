"use client"

import { useState, useRef, useMemo } from "react"
import Link from "next/link"

const COLORS = [
  "#8b5cf6", "#06b6d4", "#ef4444", "#f59e0b", "#10b981", "#3b82f6",
  "#ec4899", "#14b8a6", "#f97316", "#6366f1",
]

const DEFAULT_OPTIONS = ["iPhone 17 Pro", "Galaxy S26", "Pixel 10 Pro", "OnePlus 15", "Nothing Phone 3", "Xiaomi 17"]

export default function SpinWheelPage() {
  const [customOptions, setCustomOptions] = useState<string[]>([])
  const [inputText, setInputText] = useState("")
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [result, setResult] = useState<string | null>(null)

  const options = customOptions.length >= 2 ? customOptions : DEFAULT_OPTIONS
  const segmentAngle = 360 / options.length

  function addOption() {
    const trimmed = inputText.trim()
    if (trimmed && !customOptions.includes(trimmed)) {
      setCustomOptions([...customOptions, trimmed])
      setInputText("")
    }
  }

  function removeOption(label: string) {
    setCustomOptions(customOptions.filter((o) => o !== label))
  }

  function usePreset() {
    setCustomOptions([])
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
          Add your shortlisted phones below, then spin to let fate decide!
        </p>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addOption()}
          placeholder="Add a phone name..."
          className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400 transition-colors"
        />
        <button
          onClick={addOption}
          disabled={!inputText.trim()}
          className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Add
        </button>
      </div>

      {customOptions.length > 0 && (
        <div className="mt-4 max-w-md mx-auto">
          <div className="flex flex-wrap gap-2">
            {customOptions.map((opt) => (
              <span key={opt} className="inline-flex items-center gap-1 rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700">
                {opt}
                <button onClick={() => removeOption(opt)} className="text-violet-400 hover:text-violet-600">&times;</button>
              </span>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <button onClick={usePreset} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              Reset to presets
            </button>
            <span className="text-xs text-gray-400">{customOptions.length} option{customOptions.length !== 1 ? "s" : ""}</span>
          </div>
        </div>
      )}

      {customOptions.length === 1 && (
        <p className="mt-2 text-xs text-amber-600 text-center">Add at least 2 options to spin!</p>
      )}

      <div className="relative mt-10 mx-auto w-72 h-72 sm:w-80 sm:h-80">
        <div className={`absolute -top-6 left-1/2 -translate-x-1/2 z-10 text-3xl ${spinning ? "animate-bounce" : ""}`}>👇</div>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-xl"
          style={{ transform: `rotate(${rotation}deg)`, transition: spinning ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none" }}
        >
          {options.map((label, i) => {
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
            const short = label.length > 12 ? label.slice(0, 11) + "…" : label
            return (
              <g key={label}>
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
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5"
        >
          {spinning ? "Spinning..." : "Spin the Wheel!"}
        </button>
      </div>

      {result && (
        <div className="mt-8 rounded-2xl border border-violet-100 bg-violet-50 p-6 text-center animate-fade-in">
          <div className="text-4xl mb-2">📱</div>
          <p className="text-lg font-semibold text-violet-900">
            You got: <span className="text-violet-700">{result}</span>
          </p>
          <p className="mt-1 text-sm text-violet-600">Time to check it out!</p>
          <div className="mt-4 flex justify-center gap-3">
            <Link
              href={`/products?q=${encodeURIComponent(result)}`}
              className="inline-flex items-center gap-1 rounded-lg bg-white px-4 py-2 text-sm font-medium text-violet-700 shadow-sm hover:shadow transition-all"
            >
              View Details
            </Link>
            <button
              onClick={spin}
              className="rounded-lg border border-violet-200 px-4 py-2 text-sm font-medium text-violet-600 hover:bg-violet-100 transition-all"
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

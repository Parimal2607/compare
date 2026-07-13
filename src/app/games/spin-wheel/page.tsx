"use client"

import { useState, useRef } from "react"
import Link from "next/link"

const SEGMENTS = [
  { label: "Flagship", color: "#8b5cf6", emoji: "👑" },
  { label: "Budget", color: "#06b6d4", emoji: "💰" },
  { label: "Gaming", color: "#ef4444", emoji: "🎮" },
  { label: "Camera", color: "#f59e0b", emoji: "📸" },
  { label: "Foldable", color: "#10b981", emoji: "📱" },
  { label: "Battery", color: "#3b82f6", emoji: "🔋" },
]

const SEGMENT_ANGLE = 360 / SEGMENTS.length

export default function SpinWheelPage() {
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [result, setResult] = useState<{ label: string; emoji: string } | null>(null)
  const wheelRef = useRef<SVGSVGElement>(null)

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
      const winningIndex = Math.floor(normalized / SEGMENT_ANGLE)
      setResult(SEGMENTS[winningIndex])
      setSpinning(false)
    }, 4000)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8 text-center">
      <div className="mb-6">
        <Link href="/games" className="text-sm text-violet-600 hover:text-violet-700">&larr; Back to Games</Link>
      </div>
      <h1 className="text-3xl font-bold text-gray-900">Spin the Wheel</h1>
      <p className="mt-2 text-gray-500">What kind of phone should you look for?</p>

      <div className="relative mt-10 mx-auto w-72 h-72 sm:w-80 sm:h-80">
        <div className={`absolute -top-6 left-1/2 -translate-x-1/2 z-10 text-3xl transition-transform ${spinning ? "animate-bounce" : ""}`}>👇</div>
        <svg
          ref={wheelRef}
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-xl"
          style={{ transform: `rotate(${rotation}deg)`, transition: spinning ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none" }}
        >
          {SEGMENTS.map((seg, i) => {
            const startAngle = i * SEGMENT_ANGLE - 90
            const endAngle = (i + 1) * SEGMENT_ANGLE - 90
            const startRad = (startAngle * Math.PI) / 180
            const endRad = (endAngle * Math.PI) / 180
            const x1 = 50 + 50 * Math.cos(startRad)
            const y1 = 50 + 50 * Math.sin(startRad)
            const x2 = 50 + 50 * Math.cos(endRad)
            const y2 = 50 + 50 * Math.sin(endRad)
            const midAngle = ((startAngle + endAngle) / 2 * Math.PI) / 180
            const labelR = 35
            const lx = 50 + labelR * Math.cos(midAngle)
            const ly = 50 + labelR * Math.sin(midAngle)
            return (
              <g key={seg.label}>
                <path d={`M50,50 L${x1},${y1} A50,50 0 0,1 ${x2},${y2} Z`} fill={seg.color} stroke="white" strokeWidth="0.5" />
                <text
                  x={lx} y={ly}
                  textAnchor="middle" dominantBaseline="central"
                  fill="white" fontSize="3.5" fontWeight="bold"
                  transform={`rotate(${(startAngle + endAngle) / 2}, ${lx}, ${ly})`}
                >
                  {seg.label}
                </text>
              </g>
            )
          })}
          <circle cx="50" cy="50" r="8" fill="white" stroke="#e5e7eb" strokeWidth="2" />
        </svg>
      </div>

      <button
        onClick={spin}
        disabled={spinning}
        className="mt-10 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5"
      >
        {spinning ? "Spinning..." : "Spin the Wheel!"}
      </button>

      {result && (
        <div className="mt-8 rounded-2xl border border-violet-100 bg-violet-50 p-6 animate-fade-in">
          <div className="text-4xl mb-2">{result.emoji}</div>
          <p className="text-lg font-semibold text-violet-900">
            You got: <span className="text-violet-700">{result.label}</span>
          </p>
          <p className="mt-1 text-sm text-violet-600">
            {result.label === "Flagship" && "Go big or go home! Check out our premium phone comparisons."}
            {result.label === "Budget" && "Great value awaits! Browse our budget-friendly picks."}
            {result.label === "Gaming" && "Time to level up! Find the best gaming phones."}
            {result.label === "Camera" && "Say cheese! Discover top camera phones."}
            {result.label === "Foldable" && "The future is folding! Explore foldable phones."}
            {result.label === "Battery" && "Power up! Find phones with the best battery life."}
          </p>
          <Link
            href="/products"
            className="mt-4 inline-flex items-center gap-1 rounded-lg bg-white px-4 py-2 text-sm font-medium text-violet-700 shadow-sm hover:shadow transition-all"
          >
            Browse {result.label} Phones
          </Link>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}

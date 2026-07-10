"use client"

import { useState, useEffect, useCallback } from "react"
import SafeImage from "@/components/SafeImage"
import Link from "next/link"
import type { Comparison, Product } from "@/data/types"

interface SlideData {
  comparison: Comparison
  productA: Product | null
  productB: Product | null
}

export default function HeroSlider({ slides }: { slides: SlideData[] }) {
  const [current, setCurrent] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  if (slides.length === 0) return null

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrent(index)
    setTimeout(() => setIsTransitioning(false), 700)
  }, [isTransitioning])

  const next = useCallback(() => {
    goTo((current + 1) % slides.length)
  }, [current, goTo, slides.length])

  useEffect(() => {
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [next])

  const slide = slides[current]

  return (
    <section className="relative h-[85vh] min-h-[600px] max-h-[800px] overflow-hidden bg-gray-950">
      {slides.map((s, i) => (
        <div
          key={s.comparison.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            i === current ? "opacity-80 scale-100" : "opacity-0 scale-110"
          }`}
        >
          <SafeImage
            src={s.comparison.heroImage || s.productA?.heroImage || s.productA?.image || ""}
            alt={s.comparison.title}
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-gray-950/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-gray-950/30 via-transparent to-gray-950/30" />

      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-1.5 text-sm text-white/70 backdrop-blur-xl shadow-sm">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
              Featured Comparison
            </div>

            <div className="mb-6 flex items-center gap-5">
              {slide.productA && (
                <div className="relative h-24 w-24 bg-white/10 overflow-hidden rounded-2xl border-2 border-white/20 shadow-xl shadow-black/30 shrink-0">
                  <SafeImage
                    src={slide.productA.heroImage || slide.productA.image || ""}
                    alt={slide.productA.name}
                    fill
                    className="object-contain"
                    sizes="96px"
                  />
                </div>
              )}
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-blue-500 text-base font-bold text-white shadow-xl shadow-violet-500/30 ring-4 ring-white/30 shrink-0">
                VS
              </span>
              {slide.productB && (
                <div className="relative h-24 w-24 bg-white/10 overflow-hidden rounded-2xl border-2 border-white/20 shadow-xl shadow-black/30 shrink-0">
                  <SafeImage
                    src={slide.productB.heroImage || slide.productB.image || ""}
                    alt={slide.productB.name}
                    fill
                    className="object-contain"
                    sizes="96px"
                  />
                </div>
              )}
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-3">
              {slide.productA && (
                <span className="rounded-xl border border-white/10 bg-white/[0.06] px-3.5 py-1.5 text-sm font-medium text-white/90 backdrop-blur-xl shadow-sm">
                  {slide.productA.name}
                </span>
              )}
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white/70 backdrop-blur-sm border border-white/10">
                VS
              </span>
              {slide.productB && (
                <span className="rounded-xl border border-white/10 bg-white/[0.06] px-3.5 py-1.5 text-sm font-medium text-white/90 backdrop-blur-xl shadow-sm">
                  {slide.productB.name}
                </span>
              )}
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight line-clamp-3">
              {slide.comparison.title}
            </h1>

            <p className="mt-5 max-w-xl text-base text-white/60 leading-relaxed sm:text-lg line-clamp-3">
              {slide.comparison.description}
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href={`/compare/${slide.comparison.slug}`}
                className="group inline-flex h-12 items-center gap-2 rounded-2xl bg-white px-7 text-sm font-semibold text-gray-900 shadow-2xl shadow-white/10 transition-all duration-500 hover:shadow-white/20 hover:-translate-y-0.5"
              >
                View Full Comparison
                <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/categories"
                className="inline-flex h-12 items-center rounded-2xl border border-white/10 bg-white/[0.04] px-7 text-sm font-semibold text-white/80 backdrop-blur-xl transition-all duration-500 hover:bg-white/[0.08] hover:text-white shadow-sm"
              >
                Browse All
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 flex items-center gap-3">
        {slides.map((s, i) => (
          <button
            key={s.comparison.id}
            onClick={() => goTo(i)}
            className={`group relative rounded-full transition-all duration-700 ${
              i === current
                ? "w-14 h-1.5 bg-white/80 shadow-lg shadow-white/20"
                : "w-1.5 h-1.5 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>

      <div className="absolute bottom-8 right-8 z-20">
        <div className="flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.04] px-3.5 py-1.5 text-xs text-white/30 backdrop-blur-xl">
          <span className="font-semibold text-white/60">{String(current + 1).padStart(2, "0")}</span>
          <span className="text-white/20">/</span>
          <span>{String(slides.length).padStart(2, "0")}</span>
        </div>
      </div>
    </section>
  )
}

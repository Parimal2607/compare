"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import SafeImage from "@/components/SafeImage"

interface BannerSlide {
  image: string
}

export default function HeroBanner({ slides }: { slides: BannerSlide[] }) {
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

  return (
    <section className="relative h-[70vh] min-h-[500px] max-h-[700px] overflow-hidden bg-gray-950">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <SafeImage
            src={slide.image}
            alt=""
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-gray-950/10" />

      <div className="relative z-10 flex h-full items-end pb-16 sm:pb-20 lg:pb-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1] animate-fade-in">
              Find the Perfect Smartphone
            </h1>
            <p className="mt-5 max-w-xl text-base text-white/60 leading-relaxed sm:text-lg animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
              Side-by-side comparisons, expert verdicts, and unbiased reviews to help you choose the best phone for your needs.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <Link
                href="/categories"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-gray-900 shadow-xl shadow-white/5 transition-all duration-500 hover:shadow-2xl hover:shadow-white/10 hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Start Comparing
                <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/products"
                className="inline-flex h-12 items-center rounded-full border border-white/10 bg-white/[0.06] px-7 text-sm font-semibold text-white/80 backdrop-blur-xl transition-all duration-500 hover:bg-white/[0.12] hover:text-white active:scale-[0.98]"
              >
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-500 ${
              i === current
                ? "h-2 w-8 bg-white shadow-md shadow-white/20"
                : "h-2 w-2 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
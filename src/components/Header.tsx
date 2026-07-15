"use client"

import Link from "next/link"
import { useState, useEffect } from "react"

const links = [
  { href: "/", label: "Home" },
  { href: "/categories", label: "Categories" },
  { href: "/products", label: "Products" },
  { href: "/games", label: "Games" },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const close = () => setOpen(false)
    window.addEventListener("resize", close)
    return () => window.removeEventListener("resize", close)
  }, [])

  return (
    <header className="relative z-50">
      <div className="mx-auto mt-4 flex w-max max-w-full items-center gap-6 rounded-full border border-white/10 bg-white/75 px-5 py-2.5 shadow-lg shadow-black/[0.03] backdrop-blur-2xl supports-[backdrop-filter]:bg-white/60 sm:px-7 sm:py-3">
        <Link href="/" className="flex items-center gap-2.5 group shrink-0" onClick={() => setOpen(false)}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-xs font-bold text-white shadow-inner shadow-white/20 transition-transform duration-500 group-hover:scale-105 sm:h-9 sm:w-9 sm:text-sm">
            C
          </div>
          <span className="text-base font-bold tracking-tight text-gray-800 sm:text-lg">
            CompareHub
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-gray-500 transition-all duration-300 hover:bg-violet-50 hover:text-violet-700 sm:px-4"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="flex md:hidden h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-violet-50 hover:text-violet-700"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            {open ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <>
          <div className="fixed inset-0 top-0 z-40" onClick={() => setOpen(false)} />
          <nav className="absolute right-1/2 translate-x-1/2 top-full mt-2 z-50 flex w-[calc(100%-2rem)] max-w-xs flex-col gap-1 rounded-2xl border border-gray-100 bg-white p-3 shadow-xl shadow-black/5 md:hidden">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-violet-50 hover:text-violet-700"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </>
      )}
    </header>
  )
}

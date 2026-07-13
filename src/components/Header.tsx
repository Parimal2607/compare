import Link from "next/link"

export default function Header() {
  return (
    <header className="relative z-50">
      <div className="mx-auto mt-4 flex w-max max-w-full items-center gap-6 rounded-full border border-white/10 bg-white/75 px-5 py-2.5 shadow-lg shadow-black/[0.03] backdrop-blur-2xl supports-[backdrop-filter]:bg-white/60 sm:px-7 sm:py-3">
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-xs font-bold text-white shadow-inner shadow-white/20 transition-transform duration-500 group-hover:scale-105 sm:h-9 sm:w-9 sm:text-sm">
            C
          </div>
          <span className="text-base font-bold tracking-tight text-gray-800 sm:text-lg">
            CompareHub
          </span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          {[
            { href: "/", label: "Home" },
            { href: "/categories", label: "Categories" },
            { href: "/products", label: "Products" },
            { href: "/games", label: "Games" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-gray-500 transition-all duration-300 hover:bg-violet-50 hover:text-violet-700 sm:px-4"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
import Link from "next/link"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/70 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/60 shadow-sm shadow-black/[0.03]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-500 text-sm font-bold text-white shadow-lg shadow-violet-200/50 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-violet-300/50 group-hover:scale-105">
            C
          </div>
          <span className="text-lg font-bold tracking-tight">
            <span className="bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
              Compare
            </span>
            <span className="text-gray-800">Hub</span>
          </span>
        </Link>
        <nav className="flex items-center gap-8 text-sm font-medium">
          <Link
            href="/"
            className="text-gray-500 transition-all duration-300 hover:text-violet-600 relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-gradient-to-r after:from-violet-500 after:to-blue-500 after:transition-all after:duration-300 hover:after:w-full"
          >
            Home
          </Link>
          <Link
            href="/categories"
            className="text-gray-500 transition-all duration-300 hover:text-violet-600 relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-gradient-to-r after:from-violet-500 after:to-blue-500 after:transition-all after:duration-300 hover:after:w-full"
          >
            Categories
          </Link>
          <Link
            href="/products"
            className="text-gray-500 transition-all duration-300 hover:text-violet-600 relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-gradient-to-r after:from-violet-500 after:to-blue-500 after:transition-all after:duration-300 hover:after:w-full"
          >
            Products
          </Link>
        </nav>
      </div>
    </header>
  )
}

import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600 text-xs font-bold text-white shadow-sm">
              C
            </div>
            <span className="text-sm font-semibold text-gray-600">CompareHub</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <Link href="/about" className="hover:text-violet-600 transition-colors">About</Link>
            <Link href="/privacy" className="hover:text-violet-600 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-violet-600 transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-violet-600 transition-colors">Contact</Link>
          </div>
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} CompareHub
          </p>
        </div>
      </div>
    </footer>
  )
}
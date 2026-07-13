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
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} CompareHub
          </p>
        </div>
      </div>
    </footer>
  )
}
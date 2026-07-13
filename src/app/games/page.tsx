import Link from "next/link"

export default function GamesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-4 py-1 text-xs font-medium text-violet-700">
          Fun Zone
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Games</h1>
        <p className="mt-3 text-lg text-gray-500">Take a break and have some fun</p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <Link
          href="/games/spin-wheel"
          className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-100/50"
        >
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-2xl shadow-lg shadow-violet-200">
            🎡
          </div>
          <h2 className="text-xl font-bold text-gray-900 group-hover:text-violet-600 transition-colors">Spin the Wheel</h2>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">
            Can&apos;t decide which phone to pick? Spin the wheel and let fate decide!
          </p>
          <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-violet-600">
            Play now
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </Link>

        <Link
          href="/games/tic-tac-toe"
          className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-100/50"
        >
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-2xl shadow-lg shadow-blue-200">
            ✕
          </div>
          <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Tic-Tac-Toe</h2>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">
            Classic tic-tac-toe with a phone twist. Play against a friend!
          </p>
          <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-600">
            Play now
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </Link>
      </div>
    </div>
  )
}

import Link from "next/link"
import { gameSchema } from "@/lib/schema"
import type { Metadata } from "next"
import { siteUrl } from "@/lib/site-url"

export const metadata: Metadata = {
  title: "Games - Phone Wheel Spin & Tic-Tac-Toe | CompareHub",
  description:
    "Spin the wheel to discover your next phone or play Tic-Tac-Toe (iPhone vs Android). Fun interactive games for phone enthusiasts.",
  openGraph: {
    title: "Games | CompareHub",
    description:
      "Spin the wheel to discover your next phone or play Tic-Tac-Toe (iPhone vs Android).",
  },
}

const baseUrl = siteUrl()

const spinWheelSchema = gameSchema({
  name: "Phone Spin the Wheel",
  description: "Spin a wheel to discover which phone category suits you best. Add your own phone options and let fate decide.",
  url: `${baseUrl}/games/spin-wheel`,
})

const tictacSchema = gameSchema({
  name: "Phone Tic-Tac-Toe",
  description: "Play Tic-Tac-Toe against the computer. iPhone (X) vs Android (O) themed game.",
  url: `${baseUrl}/games/tic-tac-toe`,
})

export default function GamesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(spinWheelSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(tictacSchema) }} />
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-4 py-1 text-xs font-medium text-violet-700">
            Fun Zone
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Games</h1>
          <p className="mt-3 text-lg text-gray-500">Interactive games to help you discover phones and have fun</p>
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
              Add your own phone options or use presets &mdash; spin and let fate decide which phone you should get!
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
              iPhone vs Android &mdash; play against the computer in this classic strategy game.
            </p>
            <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-600">
              Play now
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </Link>
        </div>

        <div className="mt-16 rounded-2xl border border-gray-100 bg-gray-50 p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Why Play on CompareHub?</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Our interactive games make phone shopping fun. Use the Spin the Wheel to randomly pick a phone from your shortlist,
            or settle the iPhone vs Android debate with a friendly game of Tic-Tac-Toe. All games are free and work in your browser.
          </p>
        </div>
      </div>
    </>
  )
}

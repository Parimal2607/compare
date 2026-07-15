import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about CompareHub — honest product comparisons and reviews.",
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">About CompareHub</h1>
      <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
        <p>
          CompareHub is a free online tool that helps you make informed buying decisions
          by comparing products side-by-side. We focus on smartphones, laptops, and consumer
          electronics — covering specs, prices, pros, and cons.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">Why We Built It</h2>
        <p>
          Shopping for tech is overwhelming. Hundreds of models, confusing spec sheets,
          and biased reviews. We built CompareHub to give you a clean, unbiased,
          side-by-side view of the products you care about — all in one place.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">What You Can Compare</h2>
        <ul>
          <li>Latest smartphones from Apple, Samsung, Google, OnePlus, Xiaomi, and more</li>
          <li>Specs, prices, ratings, and user reviews at a glance</li>
          <li>Head-to-head comparisons with detailed breakdowns</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">Our Mission</h2>
        <p>
          To make product research simple, transparent, and accessible for everyone —
          no matter where you are in the world.
        </p>
      </div>
    </div>
  )
}

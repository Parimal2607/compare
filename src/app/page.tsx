import Link from "next/link"
import { getCategoryComparisonsMap, getComparisonCount } from "@/data/comparisons"
import { getCategoryNames, getProductCount, getProducts } from "@/data/products"
import HeroBanner from "@/components/HeroBanner"
import ComparisonCard from "@/components/ComparisonCard"
import LatestProductsSection from "@/components/LatestProductsSection"
import PageWithSidebar from "@/components/PageWithSidebar"
import { websiteSchema } from "@/lib/schema"

export const revalidate = 60

export default async function Home() {
  const [categoryData, totalComparisons, categoryNames, productCount, products] = await Promise.all([
    getCategoryComparisonsMap(4),
    getComparisonCount(),
    getCategoryNames(),
    getProductCount(),
    getProducts(),
  ])

  const wsSchema = websiteSchema()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(wsSchema) }}
      />
      <HeroBanner slides={[
        { image: "https://www.triveniworld.com/cdn/shop/articles/top-mobile-phones-of-2025-guides-and-reviews-triveni-world.webp?v=1736040418" },
        { image: "https://www.gizmochina.com/wp-content/uploads/2025/07/Upcoming-smartphones-July-2025.png" },
        { image: "https://s3b.cashify.in/gpro/uploads/2022/07/07020311/Best-Mobile-Phones-In-The-World.jpg" },
      ]} />

      <PageWithSidebar>

      <section className="border-b border-gray-100 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              { value: `${totalComparisons}`, label: "comparisons" },
              { value: `${productCount}`, label: "products reviewed" },
              { value: "99%", label: "unbiased reviews" },
              { value: `${categoryNames.length}`, label: "categories" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-violet-600 sm:text-4xl">{stat.value}</div>
                <div className="mt-1 text-sm text-gray-500 lowercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LatestProductsSection products={products} />

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center">
          We make choosing easy
        </h2>
        <p className="mt-3 text-gray-500 text-center max-w-xl mx-auto">
          Three steps to find the perfect product for your needs.
        </p>
        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {[
            {
              step: "01",
              title: "Pick a Comparison",
              desc: "Browse our library of head-to-head product comparisons across multiple categories.",
            },
            {
              step: "02",
              title: "Compare Side-by-Side",
              desc: "See specs, pros, cons, and prices laid out clearly so you can evaluate at a glance.",
            },
            {
              step: "03",
              title: "Read the Verdict",
              desc: "Our expert verdict tells you which product wins and why — so you can buy with confidence.",
            },
          ].map((item) => (
            <div key={item.step} className="group relative rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-500 hover:shadow-lg hover:shadow-gray-200/50 hover:-translate-y-1">
              <span className="text-5xl font-bold text-violet-100 transition-colors duration-500 group-hover:text-violet-200">{item.step}</span>
              <h3 className="mt-4 font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center">
            Featured Comparisons
          </h2>
          <p className="mt-2 text-gray-500 text-center">Our most popular head-to-head battles</p>

          {categoryData.map(({ category, comparisons, productMap }, ci) => (
            <div key={category.id} className={`${ci > 0 ? "mt-16" : "mt-12"}`}>
              <div className="mb-8 flex items-end justify-between border-b border-gray-100 pb-4">
                <h3 className="text-2xl font-bold text-gray-900">{category.name}</h3>
                <Link
                  href={`/categories/#${category.slug}`}
                  className="flex items-center gap-1 text-sm font-semibold text-violet-600 transition-colors hover:text-violet-700"
                >
                  Show All
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {comparisons.map((comparison) => {
                  const products = productMap.get(comparison.id)
                  return (
                    <ComparisonCard
                      key={comparison.id}
                      comparison={comparison}
                      productA={products?.productA}
                      productB={products?.productB}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center">
          Browse by Category
        </h2>
        <p className="mt-2 text-gray-500 text-center">Find comparisons in your favorite category</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {categoryNames.map((cat) => (
            <Link
              key={cat}
              href={`/categories#${cat.toLowerCase().replace(/\s+/g, "-")}`}
              className="group inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all duration-300 hover:border-violet-200 hover:text-violet-700 hover:shadow-md hover:shadow-violet-100"
            >
              <span className="flex h-2 w-2 rounded-full bg-violet-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              {cat}
            </Link>
          ))}
        </div>
      </section>

      </PageWithSidebar>

      <section className="border-t border-gray-100 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-10 sm:p-14 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Games & Fun</h2>
            <p className="mt-2 text-gray-500 max-w-md mx-auto">
              Spin the wheel to find your perfect phone or play a quick game of Tic-Tac-Toe.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/games/spin-wheel"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-violet-600 px-6 text-sm font-semibold text-white shadow-md transition-all duration-500 hover:bg-violet-700 hover:shadow-lg active:scale-[0.98]"
              >
                Spin the Wheel
              </Link>
              <Link
                href="/games/tic-tac-toe"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-gray-200 bg-white px-6 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-500 hover:border-gray-300 hover:shadow-md active:scale-[0.98]"
              >
                Play Tic-Tac-Toe
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-violet-600 py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Ready to find the perfect product?
          </h2>
          <p className="mt-5 text-lg text-violet-100 max-w-xl mx-auto">
            Join thousands of smart shoppers who use CompareHub to make informed decisions.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/categories"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-violet-700 shadow-lg transition-all duration-500 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Start Comparing
              <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/products"
              className="inline-flex h-12 items-center rounded-full border border-white/20 bg-white/10 px-7 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-500 hover:bg-white/20 active:scale-[0.98]"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
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

      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { value: `${totalComparisons}+`, label: "Comparisons" },
              { value: `${productCount}+`, label: "Products Reviewed" },
              { value: "99%", label: "Unbiased Reviews" },
              { value: `${categoryNames.length}+`, label: "Categories" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LatestProductsSection products={products} />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-6 text-center">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-4 py-1 text-xs font-medium text-violet-700">
            How It Works
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            We make choosing easy
          </h2>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto">
            Three simple steps to find the perfect product for your needs.
          </p>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {[
            {
              step: "01",
              title: "Pick a Comparison",
              desc: "Browse our library of head-to-head product comparisons across multiple categories.",
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              ),
            },
            {
              step: "02",
              title: "Compare Side-by-Side",
              desc: "See specs, pros, cons, and prices laid out clearly so you can evaluate at a glance.",
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
              ),
            },
            {
              step: "03",
              title: "Read the Verdict",
              desc: "Our expert verdict tells you which product wins and why — so you can buy with confidence.",
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
            },
          ].map((item) => (
            <div key={item.step} className="group relative rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-violet-100/50 hover:-translate-y-0.5">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-50 to-blue-50 text-violet-600 transition-all duration-300 group-hover:from-violet-600 group-hover:to-blue-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-violet-200">
                {item.icon}
              </div>
              <span className="text-xs font-bold tracking-widest text-violet-400">{item.step}</span>
              <h3 className="mt-2 font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-4 py-1 text-xs font-medium text-violet-700">
              Popular
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Featured Comparisons
            </h2>
            <p className="mt-2 text-gray-500">Our most popular head-to-head battles</p>
          </div>

          {categoryData.map(({ category, comparisons, productMap }) => (
            <div key={category.id} className="mb-14 last:mb-0">
              <div className="mb-6 flex items-end justify-between border-b border-gray-100 pb-4">
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

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-4 py-1 text-xs font-medium text-violet-700">
            Categories
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Browse by Category</h2>
          <p className="mt-2 text-gray-500">Find comparisons in your favorite category</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {categoryNames.map((cat) => (
            <Link
              key={cat}
              href={`/categories#${cat.toLowerCase().replace(/\s+/g, "-")}`}
              className="group inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all duration-300 hover:border-violet-200 hover:text-violet-700 hover:shadow-md hover:shadow-violet-100"
            >
              <span className="flex h-2 w-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              {cat}
            </Link>
          ))}
        </div>
      </section>

      </PageWithSidebar>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-100 bg-gradient-to-r from-violet-50 to-blue-50 p-8 sm:p-12 text-center">
            <div className="text-4xl mb-4">🎮</div>
            <h2 className="text-2xl font-bold text-gray-900">Take a Break</h2>
            <p className="mt-2 text-gray-500 max-w-md mx-auto">
              Spin the wheel to find your perfect phone or play a quick game of Tic-Tac-Toe.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                href="/games/spin-wheel"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                🎡 Spin the Wheel
              </Link>
              <Link
                href="/games/tic-tac-toe"
                className="inline-flex items-center gap-2 rounded-xl bg-white border border-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                ✕ Play Tic-Tac-Toe
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 to-blue-600 py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 h-64 w-64 translate-x-1/3 translate-y-1/3 rounded-full bg-white/5 blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Ready to find the{" "}
            <span className="bg-gradient-to-r from-violet-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
              perfect product
            </span>
            ?
          </h2>
          <p className="mt-5 text-lg text-violet-100 max-w-xl mx-auto">
            Join thousands of smart shoppers who use CompareHub to make informed decisions.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/categories"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-7 text-sm font-semibold text-violet-700 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
            >
              Start Comparing
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/products"
              className="inline-flex h-12 items-center rounded-xl border border-white/20 bg-white/10 px-7 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
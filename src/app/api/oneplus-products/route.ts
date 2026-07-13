import { NextResponse } from "next/server"
import { getCachedOnePlusProducts } from "@/lib/get-cached-oneplus-products"
import { listBrandPhones, scrapeGsmarenaPhone } from "@/lib/gsmarena-scraper"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const debug = searchParams.get("debug") === "true"

  if (debug) {
    const phones = await listBrandPhones(95)
    const first10 = phones.slice(0, 3)
    const scraped: unknown[] = []
    for (const phone of first10) {
      const result = await scrapeGsmarenaPhone(phone.specUrl)
      scraped.push({ phoneName: phone.name, result: result ? { name: result.name, specs: Object.keys(result.specs) } : null })
    }
    return NextResponse.json({
      phonesFound: phones.length,
      firstFewSlugs: phones.slice(0, 5).map((p) => p.slug),
      scrapedSample: scraped,
    })
  }

  try {
    const products = await getCachedOnePlusProducts()
    return NextResponse.json({ products, count: products.length }, {
      headers: { "Cache-Control": "no-cache, max-age=0" },
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

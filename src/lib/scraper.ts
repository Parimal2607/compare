import * as cheerio from "cheerio"

export interface ScrapedProduct {
  name: string
  description: string
  image: string
  price: string
  rating: number
  specs: Record<string, string>
  pros: string[]
  cons: string[]
}

function extractJsonLd($: cheerio.CheerioAPI): Record<string, unknown> | null {
  const scripts: string[] = []
  $('script[type="application/ld+json"]').each((_, el) => {
    const text = $(el).text()
    scripts.push(text)
  })
  for (const text of scripts) {
    try {
      const data = JSON.parse(text)
      if (data["@type"] === "Product" || data["@type"] === "SoftwareApplication") return data
      if (data["@graph"]) {
        for (const item of data["@graph"]) {
          if (item["@type"] === "Product" || item["@type"] === "SoftwareApplication") return item
        }
      }
    } catch { }
  }
  return null
}

function extractMeta($: cheerio.CheerioAPI, name: string): string | undefined {
  return $(`meta[name="${name}"], meta[property="${name}"]`).attr("content")
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

function extractGeneric($: cheerio.CheerioAPI, url: string): ScrapedProduct {
  const name =
    extractMeta($, "og:title") ||
    extractMeta($, "twitter:title") ||
    $("h1").first().text().trim() ||
    $("title").text().trim()

  const description =
    extractMeta($, "og:description") ||
    extractMeta($, "description") ||
    $('meta[name="description"]').attr("content") ||
    $("p").first().text().trim() ||
    ""

  const image =
    extractMeta($, "og:image") ||
    extractMeta($, "twitter:image") ||
    $("img[itemprop='image']").attr("src") ||
    $("main img").first().attr("src") ||
    ""

  const specs: Record<string, string> = {}
  $("th, dt").each((_, el) => {
    const key = $(el).text().trim()
    const val = $(el).next("td, dd").text().trim()
    if (key && val && !key.includes("?")) specs[key] = val
  })

  const pros: string[] = []
  const cons: string[] = []
  $("ul li").each((_, el) => {
    const text = $(el).text().trim()
    if (!text || text.length < 3) return
    if (/pro|advantage|good/i.test(text.slice(0, 10))) pros.push(text)
    else if (/con|disadvantage|bad/i.test(text.slice(0, 15))) cons.push(text)
  })

  const price =
    extractMeta($, "product:price:amount") ||
    $('[itemprop="price"]').attr("content") ||
    $(".price").first().text().trim() ||
    ""

  const ratingText =
    extractMeta($, "product:rating:value") ||
    $('[itemprop="ratingValue"]').attr("content") ||
    ""
  const rating = parseFloat(ratingText) || 0

  return { name, description, image: image.startsWith("http") ? image : "", price, rating, specs, pros, cons }
}

function extractSmartprix($: cheerio.CheerioAPI): ScrapedProduct {
  const name = $("h1").first().text().trim()
  const price = $(".price, [class*='price']").first().text().trim()
  const description = extractMeta($, "description") || ""
  const image = $(".product-img img, [class*='img'] img").first().attr("src") || ""
  const rating = parseFloat($("[class*='rating']").first().text().trim()) || 0

  const specs: Record<string, string> = {}
  $("table tr, .specs li, [class*='spec'] tr").each((_, el) => {
    const key = $(el).find("th, td:first, dt").text().trim()
    const val = $(el).find("td:last, dd").text().trim()
    if (key && val) specs[key] = val
  })

  const pros: string[] = []
  const cons: string[] = []
  $("[class*='pro'] li, .good li, [class*='positive'] li").each((_, el) => {
    const t = $(el).text().trim()
    if (t) pros.push(t)
  })
  $("[class*='con'] li, .bad li, [class*='negative'] li").each((_, el) => {
    const t = $(el).text().trim()
    if (t) cons.push(t)
  })

  return { name, description, image, price, rating, specs, pros, cons }
}

function extract91Mobiles($: cheerio.CheerioAPI): ScrapedProduct {
  const name = $("h1").first().text().trim() || $(".product-name, [class*='title'] h1").text().trim()
  const price = $(".price, [class*='price'], .prod-price").first().text().trim()
  const description = extractMeta($, "description") || ""
  const image = $(".prod-img img, [class*='gallery'] img").first().attr("src") || extractMeta($, "og:image") || ""
  const rating = parseFloat($("[class*='rating'], .rating-box").first().text().trim()) || 0

  const specs: Record<string, string> = {}
  $(".specs table tr, .specification tr, [class*='spec'] tr, .key-specs li").each((_, el) => {
    const key = $(el).find("td:first, th, dt, strong").text().trim()
    const val = $(el).find("td:last, dd, span:last").text().trim()
    if (key && val) specs[key] = val
  })

  const pros: string[] = []
  const cons: string[] = []
  $("[class*='pro'] li, .good li").each((_, el) => {
    const t = $(el).text().trim()
    if (t) pros.push(t)
  })
  $("[class*='con'] li, .bad li").each((_, el) => {
    const t = $(el).text().trim()
    if (t) cons.push(t)
  })

  return { name, description, image: image.startsWith("http") ? image : "", price, rating, specs, pros, cons }
}

export async function scrapeUrl(url: string): Promise<ScrapedProduct> {
  const hostname = new URL(url).hostname.replace("www.", "")

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml",
    },
  })

  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)

  const html = await res.text()
  const $ = cheerio.load(html)

  // Try JSON-LD first (most reliable)
  const jsonld = extractJsonLd($)
  if (jsonld) {
    const name = (jsonld.name as string) || ""
    const description = (jsonld.description as string) || ""
    const image = (Array.isArray(jsonld.image) ? jsonld.image[0] : jsonld.image) as string || ""
    const offers = jsonld.offers as Record<string, unknown> | undefined
    const price = offers?.price?.toString() || (jsonld.price as string) || ""
    const rating = jsonld.aggregateRating as Record<string, unknown> | undefined
    const ratingValue = parseFloat(rating?.ratingValue as string) || 0

    const specs: Record<string, string> = {}
    // Try to extract specs from the page even with JSON-LD
    $("table tr, .specs tr").each((_, el) => {
      const key = $(el).find("th, td:first").text().trim()
      const val = $(el).find("td:last").text().trim()
      if (key && val) specs[key] = val
    })

    return { name, description, image: image.startsWith("http") ? image : "", price: `$${price}`, rating: ratingValue, specs, pros: [], cons: [] }
  }

  // Site-specific extraction
  if (hostname.includes("smartprix")) return extractSmartprix($)
  if (hostname.includes("91mobiles")) return extract91Mobiles($)

  // Generic extraction
  return extractGeneric($, url)
}

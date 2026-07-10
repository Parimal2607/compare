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
  allRatings: Record<string, string>
  prices: Record<string, string>
  allImages: string[]
  allMeta: Record<string, string>
  rawJsonLd: Record<string, unknown>[]
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

function extractAllJsonLd($: cheerio.CheerioAPI): Record<string, unknown>[] {
  const results: Record<string, unknown>[] = []
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).text())
      if (Array.isArray(data)) results.push(...data)
      else results.push(data)
    } catch { }
  })
  return results
}

function extractAllMeta($: cheerio.CheerioAPI): Record<string, string> {
  const meta: Record<string, string> = {}
  $("meta").each((_, el) => {
    const name = $(el).attr("name") || $(el).attr("property") || ""
    const content = $(el).attr("content") || ""
    if (name && content) meta[name] = content
  })
  return meta
}

function extractAllImages($: cheerio.CheerioAPI): string[] {
  const urls = new Set<string>()
  $("img").each((_, el) => {
    const src = $(el).attr("src") || $(el).attr("data-src") || ""
    if (src.startsWith("http")) urls.add(src)
  })
  return [...urls]
}

function extractAllRatings($: cheerio.CheerioAPI): Record<string, string> {
  const ratings: Record<string, string> = {}

  // Extract all structured rating data
  $('[itemprop="ratingValue"], [class*="rating"], [class*="stars"], .rate, .score').each((_, el) => {
    const text = $(el).text().trim()
    const parent = $(el).parent().text().replace(text, "").trim()
    const label = $(el).closest("tr").find("th, td:first").text().trim() ||
      $(el).prev("span, strong, label").text().trim() ||
      $(el).closest("[class*='rating'], [class*='review']").find("h3, h4, strong").first().text().trim()
    if (text && /^[\d.]+(\/[\d.]+)?$/.test(text)) {
      const key = label || `rating_${Object.keys(ratings).length + 1}`
      ratings[key] = text
    }
  })

  // Extract from highlighted rating boxes/badges
  $(".rating-box, [class*='rating-val'], .review-score, .critic-score").each((_, el) => {
    const text = $(el).text().trim()
    const label = $(el).closest("[class*='review'], [class*='source'], [class*='site']").find("[class*='source'], [class*='name'], h4, strong").first().text().trim() ||
      $(el).prevAll("[class*='source'], [class*='label']").first().text().trim()
    if (text && /^[\d.]+(\/[\d.]+)?$/.test(text)) {
      const key = label || `rating_${Object.keys(ratings).length + 1}`
      ratings[key] = text
    }
  })

  return ratings
}

function extractAllPrices($: cheerio.CheerioAPI): Record<string, string> {
  const prices: Record<string, string> = {}

  // Find all price-like elements
  $("[class*='price'], [itemprop='price'], .cost, .amount, [class*='offer'], [class*='deal']").each((_, el) => {
    const text = $(el).text().trim()
    const label = $(el).closest("tr, li, [class*='store'], [class*='retailer']").find("th, [class*='store'], [class*='seller'], [class*='source']").first().text().trim() ||
      $(el).parent().find("[class*='label'], [class*='source'], .vendor, .retailer").first().text().trim() ||
      `price_${Object.keys(prices).length + 1}`
    if (text && /[$₹€£]\s*[\d,]+/.test(text)) {
      prices[label || `price_${Object.keys(prices).length + 1}`] = text
    }
  })

  return prices
}

function extractAllSpecs($: cheerio.CheerioAPI): Record<string, string> {
  const specs: Record<string, string> = {}

  // Extract from spec tables
  $("table").each((_, table) => {
    $(table).find("tr").each((_, row) => {
      const cells = $(row).find("th, td")
      if (cells.length >= 2) {
        const key = $(cells[0]).text().trim()
        const val = $(cells[1]).text().trim()
        if (key && val && key.length < 100 && val.length < 200) specs[key] = val
      }
    })
  })

  // Extract from definition lists
  $("dt").each((_, el) => {
    const key = $(el).text().trim()
    const val = $(el).next("dd").text().trim()
    if (key && val) specs[key] = val
  })

  // Extract from spec-style lists
  $("li, [class*='spec'], [class*='feature']").each((_, el) => {
    const text = $(el).text().trim()
    const colonIdx = text.indexOf(":")
    const pipeIdx = text.indexOf("|")
    const sepIdx = colonIdx > 0 ? colonIdx : (pipeIdx > 0 ? pipeIdx : -1)
    if (sepIdx > 0 && sepIdx < 80) {
      const key = text.slice(0, sepIdx).trim()
      const val = text.slice(sepIdx + 1).trim()
      if (key && val && !specs[key]) specs[key] = val
    }
  })

  return specs
}

function extractProsCons($: cheerio.CheerioAPI): { pros: string[]; cons: string[] } {
  const pros: string[] = []
  const cons: string[] = []

  // Find pro/con sections by heading
  $("h2, h3, h4, strong, [class*='heading']").each((_, el) => {
    const heading = $(el).text().trim().toLowerCase()
    const list = $(el).nextAll("ul, ol, div").first()

    if (/pro|advantage|good|positive|like/i.test(heading) && !/con|disadvantage/i.test(heading)) {
      list.find("li, [class*='item'], [class*='point']").each((_, item) => {
        const t = $(item).text().trim()
        if (t && t.length > 3) pros.push(t)
      })
    }
    if (/con|disadvantage|bad|negative|dislike|improvement/i.test(heading) && !/pro|advantage/i.test(heading)) {
      list.find("li, [class*='item'], [class*='point']").each((_, item) => {
        const t = $(item).text().trim()
        if (t && t.length > 3) cons.push(t)
      })
    }
  })

  // Find pro/con by class names
  $("[class*='pros'] li, [class*='pro-list'] li, .good li, [class*='positive'] li, [class*='like'] li").each((_, el) => {
    const t = $(el).text().trim()
    if (t && t.length > 3 && !pros.includes(t)) pros.push(t)
  })
  $("[class*='cons'] li, [class*='con-list'] li, .bad li, [class*='negative'] li, [class*='dislike'] li").each((_, el) => {
    const t = $(el).text().trim()
    if (t && t.length > 3 && !cons.includes(t)) cons.push(t)
  })

  // Extract comparison rows with ✓/✗ ratings
  $("tr").each((_, row) => {
    const cells = $(row).find("td")
    const label = $(row).find("th, td:first").text().trim()
    if (cells.length <= 1 || !label) return

    for (let i = 1; i < cells.length; i++) {
      const text = $(cells[i]).text().trim()
      if (text.includes("✓") || text.includes("✔") || text.includes("Yes") || text.includes("good") && text.length < 30) {
        if (!pros.includes(label)) pros.push(label)
      } else if (text.includes("✗") || text.includes("✘") || text.includes("No") || text.includes("bad") && text.length < 30) {
        if (!cons.includes(label)) cons.push(label)
      }
    }
  })

  return { pros, cons }
}

export async function scrapeUrl(url: string): Promise<ScrapedProduct> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml",
    },
  })
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)

  const html = await res.text()
  const $ = cheerio.load(html)

  // Extract everything
  const jsonlds = extractAllJsonLd($)
  const allMeta = extractAllMeta($)
  const allImages = extractAllImages($)
  const allRatings = extractAllRatings($)
  const allPrices = extractAllPrices($)
  const specs = extractAllSpecs($)
  const { pros, cons } = extractProsCons($)

  // Name
  let name = ""
  if (jsonlds.length > 0) {
    for (const j of jsonlds) {
      if (j["@type"] === "Product" || j["@type"] === "SoftwareApplication") {
        name = (j.name as string) || ""
        if (name) break
      }
    }
  }
  if (!name) name = allMeta["og:title"] || allMeta["twitter:title"] || $("h1").first().text().trim() || $("title").first().text().trim() || ""

  // Description
  let description = ""
  if (jsonlds.length > 0) {
    for (const j of jsonlds) {
      if (j["@type"] === "Product" || j["@type"] === "SoftwareApplication") {
        description = (j.description as string) || ""
        if (description) break
      }
    }
  }
  if (!description) description = allMeta["og:description"] || allMeta["description"] || $('meta[name="description"]').attr("content") || ""

  // Image
  let image = ""
  if (jsonlds.length > 0) {
    for (const j of jsonlds) {
      if (j["@type"] === "Product" || j["@type"] === "SoftwareApplication") {
        const img = j.image
        image = Array.isArray(img) ? img[0] as string : img as string
        if (image) break
      }
    }
  }
  if (!image) image = allMeta["og:image"] || allMeta["twitter:image"] || allImages[0] || ""

  // Price
  let price = ""
  if (jsonlds.length > 0) {
    for (const j of jsonlds) {
      if (j["@type"] === "Product") {
        const offers = j.offers as Record<string, unknown> | undefined
        if (offers) {
          const p = (offers.price as string) || (offers.priceSpecification as Record<string, unknown>)?.price as string || ""
          if (p) { price = `$${p}`; break }
        }
      }
    }
  }
  if (!price && Object.keys(allPrices).length > 0) {
    price = Object.values(allPrices)[0]
  }
  if (!price) price = allMeta["product:price:amount"] || $("[itemprop='price']").attr("content") || $(".price, [class*='price']").first().text().trim() || ""

  // Rating
  let rating = 0
  if (jsonlds.length > 0) {
    for (const j of jsonlds) {
      if (j["@type"] === "Product") {
        const agg = j.aggregateRating as Record<string, unknown> | undefined
        if (agg) {
          rating = parseFloat(agg.ratingValue as string) || 0
          if (rating) break
        }
      }
    }
  }
  if (!rating && Object.keys(allRatings).length > 0) {
    const firstVal = Object.values(allRatings)[0]
    const m = firstVal.match(/^([\d.]+)/)
    if (m) rating = parseFloat(m[1])
  }
  if (!rating) rating = parseFloat(allMeta["product:rating:value"]) || 0

  return {
    name,
    description,
    image: image.startsWith("http") ? image : "",
    price,
    rating,
    specs,
    pros,
    cons,
    allRatings,
    prices: allPrices,
    allImages,
    allMeta,
    rawJsonLd: jsonlds,
  }
}

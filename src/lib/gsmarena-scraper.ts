import * as cheerio from "cheerio"
import { generateDescription, rephrasePros, rephraseCons } from "./rewrite"
import { prisma } from "./prisma"
import type { Product } from "@/data/types"

const GSMARENA_BRANDS: Record<string, number> = {
  oneplus: 95,
  samsung: 9,
  google: 107,
  apple: 48,
  xiaomi: 80,
  oppo: 82,
  vivo: 98,
  realme: 118,
  motorola: 4,
}

const SPEC_KEY_MAP: Record<string, string> = {
  "Chipset": "Chipset",
  "CPU": "CPU",
  "GPU": "GPU",
  "OS": "OS",
  "Internal": "Storage",
  "Card slot": "Card Slot",
  "Technology": "Network",
  "Dimensions": "Dimensions",
  "Weight": "Weight",
  "SIM": "SIM",
  "Type": "Display Type",
  "Size": "Display Size",
  "Resolution": "Display Resolution",
  "Protection": "Display Protection",
  "Dual": "Rear Camera",
  "Single": "Selfie Camera",
  "Features": "Camera Features",
  "Video": "Video",
  "Loudspeaker": "Loudspeaker",
  "WLAN": "WLAN",
  "Bluetooth": "Bluetooth",
  "Positioning": "GPS",
  "NFC": "NFC",
  "Infrared port": "Infrared",
  "Radio": "Radio",
  "USB": "USB",
  "Sensors": "Sensors",
  "Battery": "Battery",
  "Charging": "Charging",
  "Colors": "Colors",
  "Models": "Models",
  "Price": "Price",
}

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

async function retryFetch(url: string, retries = 3): Promise<{ res: Response } | { error: string; status?: number }> {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
        },
      })
      if (res.ok) return { res }
      if (res.status === 429 || res.status === 403 || res.status >= 500) {
        if (i < retries) await delay(4000 * (i + 1))
        continue
      }
      return { error: `HTTP ${res.status}`, status: res.status }
    } catch (err) {
      if (i < retries) {
        await delay(3000 * (i + 1))
        continue
      }
      return { error: String(err) }
    }
  }
  return { error: "All retries exhausted" }
}

export interface GsmarenaPhoneSource {
  name: string
  slug: string
  image: string
  specUrl: string
  announced: string
}

export async function listBrandPhones(brandId: number): Promise<GsmarenaPhoneSource[]> {
  const brandSlug = Object.entries(GSMARENA_BRANDS).find(([, id]) => id === brandId)?.[0] || `brand-${brandId}`
  const phones: GsmarenaPhoneSource[] = []
  let page = 1
  let hasMore = true

  while (hasMore) {
    if (page > 1) await delay(1500) // pace pagination to avoid rate limiting
    const url = page === 1
      ? `https://www.gsmarena.com/${brandSlug}-phones-${brandId}.php`
      : `https://www.gsmarena.com/${brandSlug}-phones-f-${brandId}-0-p${page}.php`
    const fetched = await retryFetch(url)
    if ("error" in fetched) break

    const html = await fetched.res.text()
    const $ = cheerio.load(html)
    const items = $(".makers ul li a")

    if (items.length === 0) {
      hasMore = false
      break
    }

    items.each((_, el) => {
      const href = $(el).attr("href") || ""
      if (!href || href === "#") return
      const name = $(el).find("strong span").text().trim() || $(el).find("strong").text().trim()
      const img = $(el).find("img").attr("src") || ""
      const title = $(el).find("img").attr("title") || ""
      const announced = title.match(/Announced\s+([^.]+)/)?.[1]?.trim() || ""
      phones.push({
        name: name || href.replace(/\.php$/, "").split("-").pop() || "",
        slug: href.replace(/\.php$/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        image: img.startsWith("http") ? img : `https://fdn2.gsmarena.com${img.startsWith("/") ? "" : "/"}${img}`,
        specUrl: `https://www.gsmarena.com/${href}`,
        announced,
      })
    })

    const nav = $(".nav-pages")
    const currentPage = nav.find("strong").text().trim()
    const nextLink = nav.find("a.prevnextbutton").last().attr("href")
    if (!nextLink || !currentPage || parseInt(currentPage) < page) {
      hasMore = false
    } else {
      page++
    }
  }

  return phones
}

export async function scrapeGsmarenaPhone(url: string): Promise<{
  name: string
  description: string
  image: string
  price: string
  rating: number
  specs: Record<string, string>
  pros: string[]
  cons: string[]
  sourceUrl: string
} | null> {
  try {
    const fetched = await retryFetch(url)
    if ("error" in fetched) return null

    const html = await fetched.res.text()
    const $ = cheerio.load(html)

    const name = $('h1[data-spec="modelname"]').text().trim() || $("h1").first().text().trim() || ""

    // Image
    const imgSrc = $(".specs-photo-main img").attr("src") || ""
    const image = imgSrc.startsWith("http") ? imgSrc : `https://www.gsmarena.com${imgSrc.startsWith("/") ? "" : "/"}${imgSrc}`

    // Specs
    const rawSpecs: Record<string, string> = {}
    const seenCategories = new Set<string>()

    $("#specs-list table").each((_, table) => {
      const th = $(table).find("th").first()
      const category = th.text().trim()
      if (!category || seenCategories.has(category)) return
      seenCategories.add(category)

      $(table).find("tr").each((_, row) => {
        const ttl = $(row).find("td.ttl").text().trim()
        const nfo = $(row).find("td.nfo").text().trim()
        if (ttl && nfo) {
          const mappedKey = SPEC_KEY_MAP[ttl] || ttl
          if (!rawSpecs[mappedKey]) {
            rawSpecs[mappedKey] = nfo
          }
        }
      })
    })

    // Map to friendly keys
    const specs: Record<string, string> = {}

    // Display
    if (rawSpecs["Display Type"]) specs["Display"] = rawSpecs["Display Type"]
    if (rawSpecs["Display Size"]) specs["Display"] = specs["Display"] ? `${specs["Display"]}, ${rawSpecs["Display Size"]}` : rawSpecs["Display Size"]
    if (rawSpecs["Display Resolution"] && !specs["Display"]) specs["Display"] = rawSpecs["Display Resolution"]
    if (rawSpecs["Display Protection"]) specs["Display"] = specs["Display"] ? `${specs["Display"]}, ${rawSpecs["Display Protection"]}` : rawSpecs["Display Protection"]

    // Platform
    if (rawSpecs["Chipset"]) specs["Chipset"] = rawSpecs["Chipset"]
    if (rawSpecs["OS"]) specs["OS"] = rawSpecs["OS"]
    if (rawSpecs["CPU"]) specs["CPU"] = rawSpecs["CPU"]
    if (rawSpecs["GPU"]) specs["GPU"] = rawSpecs["GPU"]

    // Memory
    if (rawSpecs["Storage"]) {
      const match = rawSpecs["Storage"].match(/(\d+GB|\d+TB).*?(\d+GB|\d+TB)\s*RAM/)
      if (match) {
        specs["Storage"] = match[1]
        specs["RAM"] = match[2]
      } else {
        specs["Storage"] = rawSpecs["Storage"]
      }
    }

    // Camera
    if (rawSpecs["Rear Camera"]) specs["Rear Camera"] = rawSpecs["Rear Camera"]
    if (rawSpecs["Selfie Camera"]) specs["Selfie Camera"] = rawSpecs["Selfie Camera"]
    if (rawSpecs["Video"] && !specs["Video"]) specs["Video"] = rawSpecs["Video"]

    // Battery
    if (rawSpecs["Battery"]) {
      const batMatch = rawSpecs["Battery"].match(/(\d+)\s*mAh/)
      if (batMatch) specs["Battery"] = `${batMatch[1]} mAh`
      else specs["Battery"] = rawSpecs["Battery"]
    }
    if (rawSpecs["Charging"]) specs["Charging"] = rawSpecs["Charging"]

    // Body
    if (rawSpecs["Dimensions"]) specs["Dimensions"] = rawSpecs["Dimensions"]
    if (rawSpecs["Weight"]) specs["Weight"] = rawSpecs["Weight"]

    // Connectivity
    if (rawSpecs["WLAN"]) specs["WLAN"] = rawSpecs["WLAN"]
    if (rawSpecs["Bluetooth"]) specs["Bluetooth"] = rawSpecs["Bluetooth"]
    if (rawSpecs["NFC"]) specs["NFC"] = rawSpecs["NFC"]
    if (rawSpecs["USB"]) specs["USB"] = rawSpecs["USB"]

    // Other useful specs
    if (rawSpecs["Sensors"]) specs["Sensors"] = rawSpecs["Sensors"]
    if (rawSpecs["Colors"]) specs["Colors"] = rawSpecs["Colors"]

    // Price
    let price = rawSpecs["Price"] || ""
    price = price.replace(/^About\s+/i, "").trim()

    // Fallback price from brief section
    if (!price) {
      price = $('[data-spec="price"]').text().trim().replace(/^About\s+/i, "").trim()
    }

    // Pros/Cons - generate from specs
    const pros: string[] = []
    const cons: string[] = []

    if (rawSpecs["Card Slot"]?.toLowerCase().includes("no")) {
      cons.push("No expandable storage")
    }
    if (rawSpecs["3.5mm jack"]?.toLowerCase().includes("no")) {
      cons.push("No headphone jack")
    }
    if (rawSpecs["Radio"]?.toLowerCase().includes("no")) {
      cons.push("No FM radio")
    }
    if (rawSpecs["Display"]?.toLowerCase().includes("amoled") || rawSpecs["Display"]?.toLowerCase().includes("oled")) {
      pros.push("Premium OLED display")
    }
    if (rawSpecs["Display"]?.includes("120Hz") || rawSpecs["Display"]?.includes("144Hz")) {
      pros.push("High refresh rate display")
    }
    if (rawSpecs["RAM"]) {
      const ramGb = parseInt(rawSpecs["RAM"])
      if (ramGb >= 12) pros.push("Generous RAM capacity")
    }
    if (rawSpecs["Battery"]) {
      const batMAh = parseInt(rawSpecs["Battery"])
      if (batMAh >= 5000) pros.push("Large battery capacity")
    }
    if (rawSpecs["NFC"]?.toLowerCase() === "yes") {
      pros.push("NFC support for contactless payments")
    }
    if (rawSpecs["Charging"]) {
      const wattMatch = rawSpecs["Charging"].match(/(\d+)W/)
      if (wattMatch && parseInt(wattMatch[1]) >= 65) pros.push("Fast charging support")
    }
    if (rawSpecs["Loudspeaker"]?.toLowerCase().includes("stereo")) {
      pros.push("Stereo speakers")
    }
    if (rawSpecs["Dimensions"]) {
      const dimMatch = rawSpecs["Dimensions"].match(/[\d.]+\s*x\s*[\d.]+\s*x\s*([\d.]+)\s*mm/)
      if (dimMatch && parseFloat(dimMatch[1]) < 8) pros.push("Slim and portable design")
    }

    // Generate description
    const description = generateDescription({ name, specs, price })

    return {
      name,
      description,
      image,
      price,
      rating: 0,
      specs,
      pros: rephrasePros(pros),
      cons: rephraseCons(cons),
      sourceUrl: url,
    }
  } catch {
    return null
  }
}

export async function listIqooPhones(): Promise<GsmarenaPhoneSource[]> {
  const allVivo = await listBrandPhones(98)
  return allVivo.filter((p) => p.name.toLowerCase().includes("iqoo") || p.name.toLowerCase().includes("iQOO"))
}

async function ensureCategory(brandName: string, log: string[]): Promise<{ id: string; name: string }> {
  let category = await prisma.category.findFirst({ where: { name: brandName } })
  if (!category) {
    const slug = brandName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || brandName.toLowerCase()
    category = await prisma.category.create({
      data: { id: slug, name: brandName, slug },
    })
    log.push(`Created ${brandName} category`)
  } else {
    log.push(`Found existing ${brandName} category`)
  }
  return { id: category.id, name: category.name }
}

async function processPhone(
  phone: GsmarenaPhoneSource,
  category: { id: string; name: string },
  log: string[],
): Promise<Product | null> {
  try {
    const existing = await prisma.product.findUnique({ where: { slug: phone.slug } })
    if (existing) {
      log.push(`Skipped ${phone.slug} (exists)`)
      return null
    }

    log.push(`Fetching ${phone.specUrl}`)
    const scraped = await scrapeGsmarenaPhone(phone.specUrl)
    if (!scraped) {
      log.push(`Scrape returned null for ${phone.slug} (${phone.specUrl})`)
      return null
    }
    if (!scraped.name) {
      log.push(`Scrape got empty name for ${phone.slug} — HTML may have unexpected structure (${phone.specUrl})`)
      return null
    }

    const productData = {
      id: phone.slug,
      slug: phone.slug,
      name: scraped.name,
      image: scraped.image,
      description: scraped.description,
      price: scraped.price || "Price not available",
      rating: scraped.rating || 0,
      categoryId: category.id,
      specs: JSON.stringify(scraped.specs),
      pros: JSON.stringify(scraped.pros),
      cons: JSON.stringify(scraped.cons),
      sourceUrl: scraped.sourceUrl,
    }

    await prisma.product.create({ data: productData })

    const saved: Product = {
      id: phone.slug,
      name: scraped.name,
      slug: phone.slug,
      image: scraped.image,
      description: scraped.description,
      price: scraped.price || "Price not available",
      rating: scraped.rating || 0,
      category: category.name,
      categoryId: category.id,
      specs: scraped.specs,
      pros: scraped.pros,
      cons: scraped.cons,
      sourceUrl: scraped.sourceUrl,
    }
    log.push(`Created ${scraped.name} (${phone.slug})`)
    return saved
  } catch (err) {
    log.push(`Error for ${phone.slug}: ${String(err)}`)
    return null
  }
}

export async function autoFetchBrandProducts(
  brandName: string,
  brandId: number,
  batchSize = 3,
): Promise<{ products: Product[]; log: string[] }> {
  const log: string[] = []
  const saved: Product[] = []

  const category = await ensureCategory(brandName, log)

  let phones: GsmarenaPhoneSource[]
  if (brandName.toLowerCase() === "iqoo") {
    phones = await listIqooPhones()
  } else {
    phones = await listBrandPhones(brandId)
  }

  log.push(`Found ${phones.length} phones from GSMArena`)
  if (phones.length === 0) return { products: [], log }

  await delay(3000)

  for (const phone of phones) {
    if (saved.length >= batchSize) break

    const existing = await prisma.product.findUnique({ where: { slug: phone.slug } })
    if (existing) {
      log.push(`Skipped ${phone.slug} (exists)`)
      continue
    }

    const result = await processPhone(phone, category, log)
    if (result) saved.push(result)
    await delay(2500)
  }

  return { products: saved, log }
}

export async function autoFetchOnePlusProducts(): Promise<{ products: Product[]; log: string[] }> {
  return autoFetchBrandProducts("OnePlus", 95)
}

export async function autoFetchMotorolaProducts(): Promise<{ products: Product[]; log: string[] }> {
  return autoFetchBrandProducts("Motorola", 4)
}

export async function autoFetchXiaomiProducts(): Promise<{ products: Product[]; log: string[] }> {
  return autoFetchBrandProducts("Xiaomi", 80)
}

export async function autoFetchIqooProducts(): Promise<{ products: Product[]; log: string[] }> {
  return autoFetchBrandProducts("iQOO", 98)
}

export async function autoFetchSamsungProducts(): Promise<{ products: Product[]; log: string[] }> {
  return autoFetchBrandProducts("Samsung", 9)
}

export async function autoFetchGoogleProducts(): Promise<{ products: Product[]; log: string[] }> {
  return autoFetchBrandProducts("Google Pixel", 107)
}

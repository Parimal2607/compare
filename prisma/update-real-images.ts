import * as dotenv from "dotenv"
import * as path from "path"
dotenv.config()

import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"

const dbPath = path.resolve(process.cwd(), "prisma/dev.db")
const dbUrl = `file:///${dbPath.replace(/\\/g, "/")}`
const adapter = new PrismaLibSql({ url: dbUrl })
const prisma = new PrismaClient({ adapter })

// GSMarena real product images for all 50 smartphone products
const GSMARENA_MAP: Record<string, string> = {
  "smartphone-1":  "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-pro-max.jpg",
  "smartphone-2":  "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s25-ultra-sm-s938.jpg",
  "smartphone-3":  "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-9-pro-xl-.jpg",
  "smartphone-4":  "https://fdn2.gsmarena.com/vv/bigpic/oneplus-13.jpg",
  "smartphone-5":  "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-15-ultra-1.jpg",
  "smartphone-6":  "https://fdn2.gsmarena.com/vv/bigpic/sony-xperia-1-vi.jpg",
  "smartphone-7":  "https://fdn2.gsmarena.com/vv/bigpic/asus-rog-phone-9-pro.jpg",
  "smartphone-8":  "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16.jpg",
  "smartphone-9":  "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s25-plus-sm-s936.jpg",
  "smartphone-10": "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-9-.jpg",
  "smartphone-11": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-fold-7-sm-f.jpg",
  "smartphone-12": "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-9-pro-fold.jpg",
  "smartphone-13": "https://fdn2.gsmarena.com/vv/bigpic/motorola-edge-50-ultra.jpg",
  "smartphone-14": "https://fdn2.gsmarena.com/vv/bigpic/nothing-phone-3.jpg",
  "smartphone-15": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-flip-7-sm-f.jpg",
  "smartphone-16": "https://fdn2.gsmarena.com/vv/bigpic/honor-magic7-pro.jpg",
  "smartphone-17": "https://fdn2.gsmarena.com/vv/bigpic/realme-gt-7-pro.jpg",
  "smartphone-18": "https://fdn2.gsmarena.com/vv/bigpic/vivo-x100-ultra.jpg",
  "smartphone-19": "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-pro.jpg",
  "smartphone-20": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s25-sm-s931.jpg",
  "smartphone-21": "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-8a.jpg",
  "smartphone-22": "https://fdn2.gsmarena.com/vv/bigpic/oneplus-12r.jpg",
  "smartphone-23": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a55-5g.jpg",
  "smartphone-24": "https://fdn2.gsmarena.com/vv/bigpic/nothing-phone-2a.jpg",
  "smartphone-25": "https://fdn2.gsmarena.com/vv/bigpic/cmf-phone-1.jpg",
  "smartphone-26": "https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-g-power-5g.jpg",
  "smartphone-27": "https://fdn2.gsmarena.com/vv/bigpic/poco-f6-pro.jpg",
  "smartphone-28": "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-14-pro-plus.jpg",
  "smartphone-29": "https://fdn2.gsmarena.com/vv/bigpic/infinix-gt-20-pro.jpg",
  "smartphone-30": "https://fdn2.gsmarena.com/vv/bigpic/tecno-camon-30-premier.jpg",
  "smartphone-31": "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-plus.jpg",
  "smartphone-32": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-fe-r1.jpg",
  "smartphone-33": "https://fdn2.gsmarena.com/vv/bigpic/motorola-razr-50-ultra.jpg",
  "smartphone-34": "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-14t-pro.jpg",
  "smartphone-35": "https://fdn2.gsmarena.com/vv/bigpic/vivo-v40-pro.jpg",
  "smartphone-36": "https://fdn2.gsmarena.com/vv/bigpic/oppo-reno12-pro.jpg",
  "smartphone-37": "https://fdn2.gsmarena.com/vv/bigpic/vivo-iqoo-13.jpg",
  "smartphone-38": "https://fdn2.gsmarena.com/vv/bigpic/realme-13-pro-plus.jpg",
  "smartphone-39": "https://fdn2.gsmarena.com/vv/bigpic/hmd-skyline.jpg",
  "smartphone-40": "https://fdn2.gsmarena.com/vv/bigpic/motorola-edge-50-neo.jpg",
  "smartphone-41": "https://fdn2.gsmarena.com/vv/bigpic/sony-xperia-10-vi.jpg",
  "smartphone-42": "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-poco-x6-pro.jpg",
  "smartphone-43": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a35-5g.jpg",
  "smartphone-44": "https://fdn2.gsmarena.com/vv/bigpic/nothing-phone-2.jpg",
  "smartphone-45": "https://fdn2.gsmarena.com/vv/bigpic/oneplus-nord-4.jpg",
  "smartphone-46": "https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-g-stylus-5g.jpg",
  "smartphone-47": "https://fdn2.gsmarena.com/vv/bigpic/anker-soundcore-phone-alpha.jpg",
  "smartphone-48": "https://fdn2.gsmarena.com/vv/bigpic/nokia-g400-5g.jpg",
  "smartphone-49": "https://fdn2.gsmarena.com/vv/bigpic/blackview-bl9000.jpg",
  "smartphone-50": "https://fdn2.gsmarena.com/vv/bigpic/zte-axon-60-ultra.jpg",
}

// Unsplash search queries for each tech product
const TECH_UNSPLASH_QUERIES: Record<string, string> = {
  "tech-1": "React JavaScript library",
  "tech-2": "Next.js framework",
  "tech-3": "Angular framework",
  "tech-4": "Vue.js framework",
  "tech-5": "Svelte JavaScript",
  "tech-6": "Nuxt.js framework",
  "tech-7": "Remix framework",
  "tech-8": "Tailwind CSS",
  "tech-9": "Bootstrap CSS",
  "tech-10": "Vite JavaScript",
  "tech-11": "Node.js",
  "tech-12": "Express.js Node",
  "tech-13": "Nest.js framework",
  "tech-14": "Django Python",
  "tech-15": "Flask Python",
  "tech-16": "FastAPI Python framework",
  "tech-17": "Spring Boot Java",
  "tech-18": "Ruby on Rails",
  "tech-19": "Laravel PHP",
  "tech-20": "ASP.NET Core",
  "tech-21": "database server PostgreSQL",
  "tech-22": "MongoDB database",
  "tech-23": "MySQL database",
  "tech-24": "database cache server",
  "tech-25": "database platform",
  "tech-26": "cloud database platform",
  "tech-27": "database ORM tool",
  "tech-28": "mobile app development React Native",
  "tech-29": "Flutter framework",
  "tech-30": "Expo React Native",
  "tech-31": "Docker containers",
  "tech-32": "Kubernetes containers",
  "tech-33": "Amazon Web Services",
  "tech-34": "website deployment hosting",
  "tech-35": "web hosting platform",
  "tech-36": "CI CD pipeline automation",
  "tech-37": "TypeScript code",
  "tech-38": "JavaScript code",
  "tech-39": "Python programming",
  "tech-40": "Golang programming",
  "tech-41": "Rust programming",
  "tech-42": "Redux JavaScript",
  "tech-43": "Zustand React",
  "tech-44": "GraphQL API",
  "tech-45": "GraphQL client library",
  "tech-46": "Jest testing",
  "tech-47": "Cypress testing",
  "tech-48": "Playwright testing",
  "tech-49": "code module bundler webpack",
  "tech-50": "Turborepo monorepo",
  "smartphone-11": "Samsung Galaxy Z Fold 7 foldable phone",
  "smartphone-12": "Google Pixel 9 Pro Fold foldable phone",
  "smartphone-15": "Samsung Galaxy Z Flip 7 flip phone",
  "smartphone-17": "Realme GT 7 Pro phone",
  "smartphone-23": "Samsung Galaxy A55 5G phone",
  "smartphone-25": "Nothing CMF Phone 1",
  "smartphone-27": "Poco F6 Pro phone",
  "smartphone-28": "Redmi Note 14 Pro Plus phone",
  "smartphone-30": "Tecno Camon 30 Premier phone",
  "smartphone-36": "Oppo Reno12 Pro phone",
  "smartphone-43": "Samsung Galaxy A35 5G phone",
  "smartphone-44": "Nothing Phone 2 smartphone",
  "smartphone-45": "OnePlus Nord 4 phone",
  "smartphone-47": "wireless bluetooth earbuds audio",
}

async function urlExists(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(5000) })
    return res.status === 200
  } catch {
    return false
  }
}

async function searchUnsplash(query: string): Promise<string | null> {
  const key = process.env.UNSPLASH_ACCESS_KEY || ""
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1`
  try {
    const res = await fetch(url, { headers: { Authorization: `Client-ID ${key}` } })
    if (!res.ok) return null
    const data = await res.json()
    if (data.results?.length > 0) {
      return data.results[0].urls.raw
    }
    return null
  } catch {
    return null
  }
}

async function main() {
  // 1. Get all products
  const products = await prisma.product.findMany()
  console.log(`Found ${products.length} products`)

  // 2. Update smartphone images from GSMarena
  const gsmUpdated = new Set<string>()
  for (const p of products) {
    if (p.categoryId !== "smartphones") continue
    const gsmUrl = GSMARENA_MAP[p.id]
    if (!gsmUrl) {
      console.log(`  No GSMarena URL for ${p.id}`)
      continue
    }
    const exists = await urlExists(gsmUrl)
    if (!exists) {
      console.log(`  GSMarena URL not found for ${p.id} (${p.name}), will search Unsplash instead`)
      continue
    }
    const image = `${gsmUrl}?w=600`
    const heroImage = `${gsmUrl}?w=1200`
    await prisma.product.update({ where: { id: p.id }, data: { image, heroImage } })
    console.log(`  ✓ ${p.name}: GSMarena image set`)
    gsmUpdated.add(p.id)
  }

  // 3. Update remaining products (tech + phones without valid GSMarena) from Unsplash
  for (const p of products) {
    if (gsmUpdated.has(p.id)) continue

    const query = TECH_UNSPLASH_QUERIES[p.id] || `${p.name} technology`
    console.log(`  Searching Unsplash for "${query}"...`)
    const raw = await searchUnsplash(query)
    if (raw) {
      const image = `${raw}&w=600`
      const heroImage = `${raw}&w=1200`
      await prisma.product.update({ where: { id: p.id }, data: { image, heroImage } })
      console.log(`  ✓ ${p.name}: Unsplash image set`)
    } else {
      console.log(`  ✗ ${p.name}: No Unsplash result, keeping existing`)
    }
    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 200))
  }

  // 4. Update comparison heroImages to use productA's heroImage
  const comparisons = await prisma.comparison.findMany()
  let compUpdated = 0
  for (const comp of comparisons) {
    const productA = await prisma.product.findUnique({ where: { id: comp.productAId }, select: { heroImage: true } })
    if (productA?.heroImage && productA.heroImage !== comp.heroImage) {
      await prisma.comparison.update({ where: { id: comp.id }, data: { heroImage: productA.heroImage } })
      compUpdated++
    }
  }
  console.log(`\nUpdated ${compUpdated} comparison heroImages`)

  console.log(`\nDone! GSMarena images set: ${gsmUpdated.size}, comparisons updated: ${compUpdated}`)
}

main().catch(console.error).finally(() => prisma.$disconnect())

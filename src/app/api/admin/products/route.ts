import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

function safeJson(val: string, fallback: string = "[]"): string {
  try { JSON.parse(val); return val } catch { return fallback }
}

export async function POST(request: Request) {
  const fd = await request.formData()
  const name = (fd.get("name") as string).trim()
  const slug = (fd.get("slug") as string).trim()
  const catId = fd.get("categoryId") as string
  const image = fd.get("image") as string
  const heroImage = fd.get("heroImage") as string
  const desc = fd.get("description") as string
  const price = fd.get("price") as string
  const rating = parseFloat(fd.get("rating") as string)
  const affiliateLink = fd.get("affiliateLink") as string
  const specs = safeJson(fd.get("specs") as string, "{}")
  const pros = safeJson(fd.get("pros") as string)
  const cons = safeJson(fd.get("cons") as string)

  const id = slug
  await prisma.product.create({
    data: { id, name, slug, image, heroImage: heroImage || null, description: desc, price, rating, categoryId: catId, specs, pros, cons, affiliateLink: affiliateLink || null },
  })
  revalidatePath("/")
  revalidatePath("/categories")
  revalidatePath("/admin/products")
  return NextResponse.json({ ok: true })
}

export async function PUT(request: Request) {
  const fd = await request.formData()
  const id = fd.get("id") as string
  const name = (fd.get("name") as string).trim()
  const slug = (fd.get("slug") as string).trim()
  const catId = fd.get("categoryId") as string
  const image = fd.get("image") as string
  const heroImage = fd.get("heroImage") as string
  const desc = fd.get("description") as string
  const price = fd.get("price") as string
  const rating = parseFloat(fd.get("rating") as string)
  const affiliateLink = fd.get("affiliateLink") as string
  const specs = safeJson(fd.get("specs") as string, "{}")
  const pros = safeJson(fd.get("pros") as string)
  const cons = safeJson(fd.get("cons") as string)

  await prisma.product.update({
    where: { id },
    data: { name, slug, image, heroImage: heroImage || null, description: desc, price, rating, categoryId: catId, specs, pros, cons, affiliateLink: affiliateLink || null },
  })
  revalidatePath("/")
  revalidatePath("/categories")
  revalidatePath("/admin/products")
  return NextResponse.json({ ok: true })
}

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

function safeJson(val: string): string {
  try { JSON.parse(val); return val } catch { return "[]" }
}

export async function POST(request: Request) {
  const fd = await request.formData()
  const title = (fd.get("title") as string).trim()
  const slug = (fd.get("slug") as string).trim()
  const catId = fd.get("categoryId") as string
  const productAId = fd.get("productAId") as string
  const productBId = fd.get("productBId") as string
  const desc = fd.get("description") as string
  const summary = fd.get("summary") as string
  const verdict = fd.get("verdict") as string
  const winnerIndex = parseInt(fd.get("winnerIndex") as string)
  const heroImage = fd.get("heroImage") as string
  const prosA = safeJson(fd.get("prosA") as string)
  const consA = safeJson(fd.get("consA") as string)
  const prosB = safeJson(fd.get("prosB") as string)
  const consB = safeJson(fd.get("consB") as string)

  const id = slug
  await prisma.comparison.create({
    data: { id, title, slug, description: desc, categoryId: catId, productAId, productBId, summary, verdict, winnerIndex, prosPerProductA: prosA, consPerProductA: consA, prosPerProductB: prosB, consPerProductB: consB, heroImage: heroImage || null },
  })
  revalidatePath("/")
  revalidatePath("/categories")
  revalidatePath("/admin/comparisons")
  return NextResponse.json({ ok: true })
}

export async function PUT(request: Request) {
  const fd = await request.formData()
  const id = fd.get("id") as string
  const title = (fd.get("title") as string).trim()
  const slug = (fd.get("slug") as string).trim()
  const catId = fd.get("categoryId") as string
  const productAId = fd.get("productAId") as string
  const productBId = fd.get("productBId") as string
  const desc = fd.get("description") as string
  const summary = fd.get("summary") as string
  const verdict = fd.get("verdict") as string
  const winnerIndex = parseInt(fd.get("winnerIndex") as string)
  const heroImage = fd.get("heroImage") as string
  const prosA = safeJson(fd.get("prosA") as string)
  const consA = safeJson(fd.get("consA") as string)
  const prosB = safeJson(fd.get("prosB") as string)
  const consB = safeJson(fd.get("consB") as string)

  await prisma.comparison.update({
    where: { id },
    data: { title, slug, description: desc, categoryId: catId, productAId, productBId, summary, verdict, winnerIndex, prosPerProductA: prosA, consPerProductA: consA, prosPerProductB: prosB, consPerProductB: consB, heroImage: heroImage || null },
  })
  revalidatePath("/")
  revalidatePath("/categories")
  revalidatePath("/admin/comparisons")
  return NextResponse.json({ ok: true })
}

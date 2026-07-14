import { prisma } from "@/lib/prisma"
import { generateWithGemini } from "@/lib/gemini"
import type { Product } from "@/data/types"

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) : str
}

export async function generateComparisonForPair(
  productA: Product,
  productB: Product,
  categoryId: string,
): Promise<{ created: boolean; slug?: string }> {
  const pairKey = [productA.id, productB.id].sort().join("-vs-")
  const slug = slugify(`${productA.name} vs ${productB.name}`)
  if (!slug) return { created: false }

  const existing = await prisma.comparison.findUnique({ where: { slug } })
  if (existing) return { created: false }

  const prompt = `You are a tech comparison expert. Compare these two products strictly based on their specs, pros, and cons below.

Product A: ${productA.name}
Category: ${productA.category}
Price: ${productA.price}
Specs: ${JSON.stringify(productA.specs)}
Pros: ${productA.pros.join(", ")}
Cons: ${productA.cons.join(", ")}

Product B: ${productB.name}
Category: ${productB.category}
Price: ${productB.price}
Specs: ${JSON.stringify(productB.specs)}
Pros: ${productB.pros.join(", ")}
Cons: ${productB.cons.join(", ")}

Return ONLY valid JSON with NO markdown formatting, no code fences, no extra text:
{
  "title": "A short compelling comparison title (max 80 chars)",
  "description": "A 2-3 sentence comparison description (max 300 chars)",
  "summary": "Detailed comparison summary analyzing key differences (max 600 chars)",
  "verdict": "Clear winner verdict with reasoning (max 300 chars)",
  "winnerIndex": 0 or 1 (0 = Product A wins, 1 = Product B wins),
  "prosA": ["pro1", "pro2", "pro3"],
  "consA": ["con1", "con2", "con3"],
  "prosB": ["pro1", "pro2", "pro3"],
  "consB": ["con1", "con2", "con3"]
}`

  let text: string
  try {
    text = await generateWithGemini(prompt)
  } catch {
    return { created: false }
  }

  // Strip markdown fences if any
  const cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*$/gm, "").trim()

  let data: Record<string, unknown>
  try {
    data = JSON.parse(cleaned)
  } catch {
    return { created: false }
  }

  if (!data.title || !data.description || !data.summary || !data.verdict) {
    return { created: false }
  }

  const prosA = Array.isArray(data.prosA) ? data.prosA.slice(0, 5) : []
  const consA = Array.isArray(data.consA) ? data.consA.slice(0, 5) : []
  const prosB = Array.isArray(data.prosB) ? data.prosB.slice(0, 5) : []
  const consB = Array.isArray(data.consB) ? data.consB.slice(0, 5) : []
  const winnerIndex = data.winnerIndex === 1 ? 1 : 0

  try {
    await prisma.comparison.create({
      data: {
        id: pairKey,
        slug,
        title: truncate(String(data.title), 80),
        description: truncate(String(data.description), 300),
        categoryId,
        productAId: productA.id,
        productBId: productB.id,
        summary: truncate(String(data.summary), 600),
        verdict: truncate(String(data.verdict), 300),
        winnerIndex,
        prosPerProductA: JSON.stringify(prosA),
        consPerProductA: JSON.stringify(consA),
        prosPerProductB: JSON.stringify(prosB),
        consPerProductB: JSON.stringify(consB),
      },
    })
    return { created: true, slug }
  } catch {
    return { created: false }
  }
}

function parseSpecs(str: string): Record<string, string> {
  try { const p = JSON.parse(str); return typeof p === "object" && p !== null ? p : {} } catch { return {} }
}
function parseArr(str: string): string[] {
  try { const p = JSON.parse(str); return Array.isArray(p) ? p : [] } catch { return [] }
}

export async function generateComparisonsForProduct(
  product: Product,
  maxPairs = 2,
): Promise<number> {
  const siblings = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id } },
    orderBy: { createdAt: "desc" },
    take: 10,
  })

  if (siblings.length === 0) return 0

  let created = 0
  for (const sibling of siblings) {
    if (created >= maxPairs) break

    const siblingProduct: Product = {
      id: sibling.id,
      name: sibling.name,
      slug: sibling.slug,
      image: sibling.image,
      description: sibling.description,
      price: sibling.price,
      rating: sibling.rating,
      category: product.category,
      categoryId: sibling.categoryId,
      specs: parseSpecs(sibling.specs),
      pros: parseArr(sibling.pros),
      cons: parseArr(sibling.cons),
      sourceUrl: sibling.sourceUrl ?? undefined,
    }

    const result = await generateComparisonForPair(product, siblingProduct, product.categoryId)
    if (result.created) created++
  }

  return created
}

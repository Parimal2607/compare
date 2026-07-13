import { NextResponse } from "next/server"
import { getCachedOnePlusProducts } from "@/lib/get-cached-oneplus-products"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const products = await getCachedOnePlusProducts()
    return NextResponse.json({ products, count: products.length }, {
      headers: { "Cache-Control": "no-cache, max-age=0" },
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

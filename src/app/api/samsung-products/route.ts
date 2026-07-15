import { NextResponse } from "next/server"
import { getCachedSamsungProducts } from "@/lib/get-cached-samsung-products"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const result = await getCachedSamsungProducts()
    return NextResponse.json({
      products: result.products,
      count: result.products.length,
      log: result.log,
    }, {
      headers: { "Cache-Control": "no-cache, max-age=0" },
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

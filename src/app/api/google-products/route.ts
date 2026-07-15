import { NextResponse } from "next/server"
import { getCachedGoogleProducts } from "@/lib/get-cached-google-products"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const result = await getCachedGoogleProducts()
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

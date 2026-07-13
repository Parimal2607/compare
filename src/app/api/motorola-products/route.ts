import { NextResponse } from "next/server"
import { getCachedMotorolaProducts } from "@/lib/get-cached-motorola-products"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const result = await getCachedMotorolaProducts()
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

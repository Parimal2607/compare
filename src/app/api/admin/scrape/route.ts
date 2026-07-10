import { NextRequest, NextResponse } from "next/server"
import { scrapeUrl } from "@/lib/scraper"

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()
    if (!url || typeof url !== "string") {
      return new NextResponse("Missing url", { status: 400 })
    }
    const data = await scrapeUrl(url)
    return NextResponse.json(data)
  } catch (e) {
    return new NextResponse(e instanceof Error ? e.message : "Scrape failed", { status: 500 })
  }
}

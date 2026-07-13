import { NextResponse } from "next/server"
import { getCachedNews } from "@/lib/get-cached-news"

export const dynamic = "force-dynamic"

export async function GET() {
  const articles = await getCachedNews()
  return NextResponse.json(articles, {
    headers: { "Cache-Control": "no-cache, max-age=0" },
  })
}
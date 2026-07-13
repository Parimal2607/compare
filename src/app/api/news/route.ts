import { NextResponse } from "next/server"
import { getCachedNews } from "@/lib/get-cached-news"

export async function GET() {
  const articles = await getCachedNews()
  return NextResponse.json(articles)
}
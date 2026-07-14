"use client"

import { useEffect } from "react"

export default function ScraperTrigger() {
  useEffect(() => {
    fetch("/api/trigger-scraper", { cache: "no-store", keepalive: true }).catch(() => {})
  }, [])
  return null
}

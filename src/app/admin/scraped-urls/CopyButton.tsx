"use client"

import { useState } from "react"

export default function CopyButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      onClick={handleCopy}
      className="rounded-lg px-3 py-1.5 text-xs font-medium text-violet-600 hover:bg-violet-50 transition-colors"
    >
      {copied ? "Copied!" : "Copy URL"}
    </button>
  )
}

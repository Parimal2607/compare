interface UnsplashImage {
  id: string
  urls: {
    raw: string
    full: string
    regular: string
    small: string
    thumb: string
  }
  alt_description: string | null
}

interface SearchResponse {
  results: UnsplashImage[]
}

export async function searchUnsplash(query: string, perPage = 30): Promise<UnsplashImage[]> {
  const key = process.env.UNSPLASH_ACCESS_KEY || ""
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}`
  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${key}` },
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Unsplash API error ${res.status}: ${body}`)
  }
  const data: SearchResponse = await res.json()
  return data.results || []
}

const sep = (url: string) => (url.includes("?") ? "&" : "?")

export function buildImageUrl(raw: string, width: number, quality = 80): string {
  return `${raw}${sep(raw)}w=${width}&q=${quality}`
}

export function resizeImageUrl(url: string, width: number): string {
  return url.replace(/w=\d+/, `w=${width}`)
}

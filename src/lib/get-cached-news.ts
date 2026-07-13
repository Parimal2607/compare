import { unstable_cache } from "next/cache"
import { fetchAndStoreNews, getNewsFromDb } from "./news"

export const getCachedNews = unstable_cache(
  async () => {
    try {
      const articles = await fetchAndStoreNews()
      if (articles.length > 0) return articles
    } catch {
      // fall through to DB
    }
    return getNewsFromDb()
  },
  ["tech-news"],
  { revalidate: 3600, tags: ["news"] }
)
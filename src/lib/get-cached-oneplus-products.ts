import { unstable_cache } from "next/cache"
import { autoFetchOnePlusProducts } from "./gsmarena-scraper"

export const getCachedOnePlusProducts = unstable_cache(
  async () => {
    return autoFetchOnePlusProducts()
  },
  ["oneplus-products"],
  { revalidate: 43200, tags: ["oneplus"] }
)

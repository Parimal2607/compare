import { unstable_cache } from "next/cache"
import { autoFetchOnePlusProducts } from "./gsmarena-scraper"

export const getCachedOnePlusProducts = unstable_cache(
  async () => {
    return autoFetchOnePlusProducts()
  },
  ["oneplus-products-v3"],
  { revalidate: 3600, tags: ["oneplus-products"] }
)

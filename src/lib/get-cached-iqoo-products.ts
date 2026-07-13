import { unstable_cache } from "next/cache"
import { autoFetchIqooProducts } from "./gsmarena-scraper"

export const getCachedIqooProducts = unstable_cache(
  async () => autoFetchIqooProducts(),
  ["iqoo-products-v2"],
  { revalidate: 3600, tags: ["iqoo-products-v2"] },
)

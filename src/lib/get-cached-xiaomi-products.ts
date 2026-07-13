import { unstable_cache } from "next/cache"
import { autoFetchXiaomiProducts } from "./gsmarena-scraper"

export const getCachedXiaomiProducts = unstable_cache(
  async () => autoFetchXiaomiProducts(),
  ["xiaomi-products"],
  { revalidate: 3600, tags: ["xiaomi-products"] },
)

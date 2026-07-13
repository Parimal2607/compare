import { unstable_cache } from "next/cache"
import { autoFetchMotorolaProducts } from "./gsmarena-scraper"

export const getCachedMotorolaProducts = unstable_cache(
  async () => autoFetchMotorolaProducts(),
  ["motorola-products"],
  { revalidate: 3600, tags: ["motorola-products"] },
)

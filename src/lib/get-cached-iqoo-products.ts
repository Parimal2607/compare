import { autoFetchIqooProducts } from "./gsmarena-scraper"

export async function getCachedIqooProducts() {
  return autoFetchIqooProducts()
}

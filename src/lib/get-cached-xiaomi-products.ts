import { autoFetchXiaomiProducts } from "./gsmarena-scraper"

export async function getCachedXiaomiProducts() {
  return autoFetchXiaomiProducts()
}

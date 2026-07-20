import { autoFetchAppleProducts } from "./gsmarena-scraper"

export async function getCachedAppleProducts() {
  return autoFetchAppleProducts()
}

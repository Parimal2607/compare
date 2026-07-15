import { autoFetchSamsungProducts } from "./gsmarena-scraper"

export async function getCachedSamsungProducts() {
  return autoFetchSamsungProducts()
}

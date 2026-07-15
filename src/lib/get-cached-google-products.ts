import { autoFetchGoogleProducts } from "./gsmarena-scraper"

export async function getCachedGoogleProducts() {
  return autoFetchGoogleProducts()
}

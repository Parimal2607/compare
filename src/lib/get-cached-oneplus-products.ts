import { autoFetchOnePlusProducts } from "./gsmarena-scraper"

export async function getCachedOnePlusProducts() {
  return autoFetchOnePlusProducts()
}

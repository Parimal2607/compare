import { autoFetchMotorolaProducts } from "./gsmarena-scraper"

export async function getCachedMotorolaProducts() {
  return autoFetchMotorolaProducts()
}

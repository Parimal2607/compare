import "dotenv/config"
import { fetchAndStoreNews } from "../src/lib/news"

async function main() {
  console.log("Fetching and storing news articles...")
  const articles = await fetchAndStoreNews()
  console.log(`Stored ${articles.length} news articles in DB`)
}

main().catch(console.error)
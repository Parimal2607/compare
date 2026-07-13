import "dotenv/config"
import { createClient } from "@libsql/client"

const turso = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

async function main() {
  try {
    await turso.execute(`CREATE TABLE NewsArticle (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      image TEXT,
      source TEXT NOT NULL,
      sourceUrl TEXT NOT NULL,
      author TEXT,
      published DATETIME NOT NULL,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`)
    console.log("Created NewsArticle table")
  } catch (e) {
    console.log("Error:", e instanceof Error ? e.message : e)
  }
  const rs = await turso.execute("SELECT name FROM sqlite_master WHERE type='table'")
  console.log("Tables:", rs.rows.map(r => r.name).join(", "))
}

main().catch(console.error)
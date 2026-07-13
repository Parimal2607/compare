import "dotenv/config"
import { createClient } from "@libsql/client"

const turso = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

async function main() {
  try {
    await turso.execute("ALTER TABLE Product ADD COLUMN sourceUrl TEXT")
    console.log("Added sourceUrl column to Turso")
  } catch (e) {
    console.log("Error:", e instanceof Error ? e.message : e)
  }
  // Verify
  const rs = await turso.execute("PRAGMA table_info(Product)")
  console.log("Columns:", rs.rows.map(r => r.name).join(", "))
}

main().catch(console.error)
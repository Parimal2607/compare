import "dotenv/config"
import { createClient } from "@libsql/client"

const turso = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

async function main() {
  try {
    const rs = await turso.execute("PRAGMA table_info(Product)")
    console.log("Turso Product columns:", rs.rows.map(r => `${r.name} (${r.type})`).join(", "))
  } catch (e) {
    console.log("Error:", e)
  }
}

main().catch(console.error)
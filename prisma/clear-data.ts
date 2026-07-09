import * as dotenv from "dotenv"
import * as path from "path"
dotenv.config()

import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"

const dbPath = path.resolve(process.cwd(), "prisma/dev.db")
const dbUrl = `file:///${dbPath.replace(/\\/g, "/")}`
const adapter = new PrismaLibSql({ url: dbUrl })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Deleting comparisons:", (await prisma.comparison.deleteMany()).count)
  console.log("Deleting products:", (await prisma.product.deleteMany()).count)
  console.log("Deleting categories:", (await prisma.category.deleteMany()).count)
  console.log("All data cleared.")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())

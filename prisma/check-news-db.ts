import "dotenv/config"
import { prisma } from "../src/lib/prisma"

async function main() {
  const count = await prisma.newsArticle.count()
  console.log(`News articles in DB: ${count}`)
  const articles = await prisma.newsArticle.findMany({ take: 3, orderBy: { published: "desc" }, select: { slug: true, title: true, source: true } })
  for (const a of articles) {
    console.log(`  ${a.slug}: ${a.title} (${a.source})`)
  }
}

main().catch(console.error)
import { getAllComparisonsGroupedByCategory } from "@/data/comparisons"
import CategoryComparisons from "@/components/CategoryComparisons"
import type { Metadata } from "next"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Browse Categories",
  description:
    "Explore product comparisons by category — smartphones, laptops, consoles, and more. Find the best products head-to-head.",
  openGraph: {
    title: "Browse Categories | CompareHub",
    description:
      "Explore product comparisons by category — smartphones, laptops, consoles, and more.",
  },
}

export default async function CategoriesPage() {
  const groups = await getAllComparisonsGroupedByCategory()
  return <CategoryComparisons groups={groups} />
}

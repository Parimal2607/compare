import { getAllComparisonsGroupedByCategory } from "@/data/comparisons"
import CategoryComparisons from "@/components/CategoryComparisons"

export const revalidate = 60

export default async function CategoriesPage() {
  const groups = await getAllComparisonsGroupedByCategory()
  return <CategoryComparisons groups={groups} />
}

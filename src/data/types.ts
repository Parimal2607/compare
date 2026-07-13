export interface Product {
  id: string
  name: string
  slug: string
  image: string
  heroImage?: string
  description: string
  price: string
  rating: number | null
  category: string
  categoryId: string
  specs: Record<string, string>
  pros: string[]
  cons: string[]
  affiliateLink?: string
}

export interface Comparison {
  id: string
  title: string
  slug: string
  description: string
  category: string
  categoryId: string
  productAId: string
  productBId: string
  summary: string
  verdict: string
  winnerIndex: 0 | 1
  prosPerProduct: [string[], string[]]
  consPerProduct: [string[], string[]]
  heroImage?: string
}

export interface Category {
  id: string
  name: string
  slug: string
}

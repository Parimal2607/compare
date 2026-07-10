function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return "http://localhost:3000"
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CompareHub",
    url: siteUrl(),
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl()}/products?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
}

export function productSchema(product: {
  name: string
  description: string
  image: string
  price: string
  rating: number
  slug: string
}) {
  const numericPrice = product.price.replace(/[^0-9.]/g, "")
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    url: `${siteUrl()}/products/${product.slug}`,
    offers: {
      "@type": "Offer",
      price: numericPrice,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      bestRating: 5,
      ratingCount: Math.round(product.rating * 20),
    },
  }
}

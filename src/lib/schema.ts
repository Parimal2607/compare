function siteUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) || "http://localhost:3000"
  return url.replace(/\/+$/, "")
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
  rating: number | null
  slug: string
}) {
  const numericPrice = product.price.replace(/[^0-9.]/g, "")
  const rating = product.rating ?? 0
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
    ...(rating > 0 ? {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: rating,
        bestRating: 5,
        ratingCount: Math.round(rating * 20),
      },
    } : {}),
  }
}

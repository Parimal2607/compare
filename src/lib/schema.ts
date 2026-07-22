import { siteUrl } from "./site-url"

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CompareHub",
    alternateName: "CompareHub - Product Comparisons",
    url: siteUrl(),
    inLanguage: "en",
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

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CompareHub",
    url: siteUrl(),
    description: "Side-by-side product comparisons and reviews across smartphones, laptops, and more.",
  }
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
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
  const numericPrice = parseFloat(product.price.replace(/[^0-9.]/g, "")) || 0
  const rating = product.rating ?? 0
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    url: `${siteUrl()}/products/${product.slug}`,
    brand: { "@type": "Brand", name: product.name.split(" ")[0] },
    offers: {
      "@type": "Offer",
      price: numericPrice,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: rating > 0 ? rating : 3,
      bestRating: 5,
      ratingCount: rating > 0 ? Math.round(rating * 20) : 1,
    },
  }
}

export function comparisonSchema(comparison: {
  title: string
  description: string
  url: string
  productA: { name: string; url: string; price: string; rating: number | null }
  productB: { name: string; url: string; price: string; rating: number | null }
}) {
  const aPrice = parseFloat(comparison.productA.price.replace(/[^0-9.]/g, "")) || 0
  const bPrice = parseFloat(comparison.productB.price.replace(/[^0-9.]/g, "")) || 0
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: comparison.title,
    description: comparison.description,
    url: comparison.url,
    category: "Comparison",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: Math.min(aPrice, bPrice),
      highPrice: Math.max(aPrice, bPrice),
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 4,
      bestRating: 5,
      ratingCount: 1,
    },
    isSimilarTo: [
      { "@type": "Product", name: comparison.productA.name, url: comparison.productA.url },
      { "@type": "Product", name: comparison.productB.name, url: comparison.productB.url },
    ],
  }
}

export function newsArticleSchema(article: {
  title: string
  description: string
  image: string
  url: string
  published: string
  author: string
  source: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.description,
    image: article.image || undefined,
    url: article.url,
    datePublished: article.published,
    author: {
      "@type": "Person",
      name: article.author || article.source,
    },
    publisher: {
      "@type": "Organization",
      name: article.source,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": article.url,
    },
  }
}

export function gameSchema(game: {
  name: string
  description: string
  url: string
  image?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: game.name,
    description: game.description,
    url: game.url,
    applicationCategory: "GameApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    ...(game.image ? { image: game.image } : {}),
  }
}

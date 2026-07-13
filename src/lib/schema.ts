import { siteUrl } from "./site-url"

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

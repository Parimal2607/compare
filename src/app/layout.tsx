import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ScraperTrigger from "@/components/ScraperTrigger"

const AD_PUBLISHER_ID = "ca-pub-5033636336412223"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

function siteUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) || "http://localhost:3000"
  return url.replace(/\/+$/, "")
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "CompareHub - Honest Product Comparisons & Reviews",
    template: "%s | CompareHub",
  },
  description:
    "Side-by-side comparisons of the latest smartphones, laptops, consoles and more. Find the best product for your needs with unbiased reviews.",
  openGraph: {
    title: "CompareHub - Honest Product Comparisons & Reviews",
    description:
      "Side-by-side comparisons of the latest smartphones, laptops, consoles and more.",
    type: "website",
    locale: "en_US",
    siteName: "CompareHub",
  },
  twitter: {
    card: "summary_large_image",
    title: "CompareHub - Honest Product Comparisons & Reviews",
    description:
      "Side-by-side comparisons of the latest smartphones, laptops, consoles and more.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl(),
    languages: {
      en: siteUrl(),
      "x-default": siteUrl(),
    },
  },
  other: {
    "google-adsense-account": AD_PUBLISHER_ID,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CompareHub",
    url: siteUrl(),
    description:
      "Side-by-side product comparisons and reviews across smartphones, laptops, and more.",
  }

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="Global" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className="min-h-screen bg-white font-sans text-gray-900 antialiased flex flex-col">
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
        <ScraperTrigger />
      </body>
    </html>
  )
}

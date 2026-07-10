import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return "http://localhost:3000"
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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-white font-sans text-gray-900 antialiased flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

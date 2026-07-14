import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/sitemap.xml",
        destination: "/sitemap/sitemap.xml",
        permanent: true,
      },
    ]
  },
}

export default nextConfig

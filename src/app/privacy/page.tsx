import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "CompareHub privacy policy — how we collect, use, and protect your data.",
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
        <p><strong>Last updated:</strong> July 2026</p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">1. Information We Collect</h2>
        <p>
          We collect minimal information to operate and improve our service:
        </p>
        <ul>
          <li><strong>Cookies:</strong> We use cookies to serve personalized advertisements via Google AdSense and to analyze site traffic.</li>
          <li><strong>Analytics:</strong> We may collect anonymous usage data (pages visited, time spent) to improve the user experience.</li>
          <li><strong>Contact Information:</strong> If you email us, we retain only what is necessary to respond.</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">2. How We Use Your Data</h2>
        <p>
          Data is used solely for: (a) serving relevant advertisements, (b) improving site content and performance, and (c) responding to inquiries.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">3. Google AdSense</h2>
        <p>
          We use Google AdSense to display ads. Google uses cookies to serve ads based on your prior visits to our website or other websites.
          You can opt out of personalized advertising by visiting Google's Ads Settings.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">4. Third-Party Services</h2>
        <p>
          We may use third-party services (Vercel for hosting, Turso for database) that have their own privacy policies. We do not sell or share personal data with third parties for marketing purposes.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">5. Contact</h2>
        <p>
          For privacy-related questions, contact us at <strong>compare@gmail.com</strong>.
        </p>
      </div>
    </div>
  )
}

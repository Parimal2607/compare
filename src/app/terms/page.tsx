import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for using CompareHub.",
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms & Conditions</h1>
      <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
        <p><strong>Last updated:</strong> July 2026</p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">1. Acceptance of Terms</h2>
        <p>
          By using CompareHub, you agree to these terms. If you do not agree, please do not use the site.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">2. Use of Service</h2>
        <p>
          CompareHub provides product comparisons for informational purposes only.
          We do not guarantee accuracy, completeness, or availability of any product information.
          Prices and specs may change without notice.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">3. Disclaimer</h2>
        <p>
          All product information is sourced from public listings and manufacturer data.
          CompareHub is not affiliated with any product brand or manufacturer.
          We are not responsible for any decisions made based on the information provided.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">4. Intellectual Property</h2>
        <p>
          All content on CompareHub — including text, comparisons, and data — is our property
          or used with permission. You may not reproduce, distribute, or modify the content
          without prior written consent.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">5. Limitation of Liability</h2>
        <p>
          CompareHub is provided &quot;as is&quot; without any warranty. We shall not be liable for any
          damages arising from the use of this site.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">6. Contact</h2>
        <p>
          For questions about these terms, contact <strong>compare@gmail.com</strong>.
        </p>
      </div>
    </div>
  )
}

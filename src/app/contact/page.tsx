import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with CompareHub — we'd love to hear from you.",
}

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Contact Us</h1>
      <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
        <p>
          Have a question, suggestion, or want to report an issue? Reach out to us:
        </p>
        <p className="text-lg">
          <strong>Email:</strong>{" "}
          <a href="mailto:compare@gmail.com" className="text-violet-600 hover:text-violet-800 underline">
            compare@gmail.com
          </a>
        </p>
        <p className="mt-8 text-sm text-gray-400">
          We aim to respond within 48 hours.
        </p>
      </div>
    </div>
  )
}

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Phone Spin the Wheel - Random Phone Picker | CompareHub",
  description:
    "Add your own phone options and spin the wheel to randomly pick your next phone. Fun decision-making tool for phone shoppers.",
  openGraph: {
    title: "Phone Spin the Wheel | CompareHub",
    description: "Add your own phone options and spin to randomly pick your next phone.",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

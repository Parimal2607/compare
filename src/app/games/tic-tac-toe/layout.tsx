import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Phone Tic-Tac-Toe - iPhone vs Android | CompareHub",
  description:
    "Play Tic-Tac-Toe against the computer. Choose iPhone (X) or Android (O) and see who wins the phone battle!",
  openGraph: {
    title: "Phone Tic-Tac-Toe | CompareHub",
    description: "Play Tic-Tac-Toe against the computer. iPhone (X) vs Android (O).",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

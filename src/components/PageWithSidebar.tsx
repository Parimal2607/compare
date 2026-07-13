import NewsSidebar from "@/components/NewsSidebar"

export default function PageWithSidebar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row w-full gap-8 lg:gap-10">
      <div className="flex-1 min-w-0">{children}</div>
      <NewsSidebar />
    </div>
  )
}
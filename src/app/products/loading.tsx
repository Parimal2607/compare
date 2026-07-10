export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <div className="h-10 w-36 animate-pulse rounded-lg bg-gray-200" />
        <div className="mt-3 h-5 w-56 animate-pulse rounded bg-gray-100" />
      </div>
      <div className="flex flex-wrap gap-3 mb-8">
        <div className="h-10 w-60 animate-pulse rounded-xl bg-gray-100" />
        <div className="h-10 w-40 animate-pulse rounded-xl bg-gray-100" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-72 animate-pulse rounded-2xl bg-gray-100" />
        ))}
      </div>
    </div>
  )
}

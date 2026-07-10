export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <div className="h-10 w-48 animate-pulse rounded-lg bg-gray-200" />
        <div className="mt-3 h-5 w-72 animate-pulse rounded bg-gray-100" />
      </div>
      <div className="mb-8 h-10 w-80 animate-pulse rounded-xl bg-gray-100" />
      <div className="space-y-16">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <div className="mb-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-100" />
              <div className="h-7 w-32 animate-pulse rounded bg-gray-200" />
              <div className="h-px flex-1 bg-gray-100" />
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-64 animate-pulse rounded-2xl bg-gray-100" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

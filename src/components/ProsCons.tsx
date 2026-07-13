interface ProsConsProps {
  pros: string[]
  cons: string[]
  label: string
  winner?: boolean
}

export default function ProsCons({ pros, cons, label, winner }: ProsConsProps) {
  return (
    <div>
      <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900">
        {label}
        {winner && (
          <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
            WINNER
          </span>
        )}
      </h3>
      <div className="space-y-4">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
          <h4 className="mb-2.5 flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Pros
          </h4>
          <ul className="space-y-2">
            {pros.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-600">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-red-100 bg-red-50/50 p-4">
          <h4 className="mb-2.5 flex items-center gap-1.5 text-sm font-semibold text-red-700">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cons
          </h4>
          <ul className="space-y-2">
            {cons.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-600">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

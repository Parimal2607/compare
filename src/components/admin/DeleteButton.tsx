"use client"

export function DeleteButton({ label, confirmMsg }: { label: string; confirmMsg: string }) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!confirm(confirmMsg)) e.preventDefault()
      }}
      className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
    >
      {label}
    </button>
  )
}

"use client"

import { useFormStatus } from "react-dom"

interface Props {
  confirmMsg: string
  disabled?: boolean
}

function SubmitButton({ confirmMsg, disabled }: Props) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={disabled || pending}
      onClick={(e) => { if (!confirm(confirmMsg)) e.preventDefault() }}
      className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-40 transition-colors"
    >
      {pending ? "Deleting..." : "Delete All"}
    </button>
  )
}

export default function DeleteAllButton({ confirmMsg, disabled }: Props) {
  return <SubmitButton confirmMsg={confirmMsg} disabled={disabled} />
}

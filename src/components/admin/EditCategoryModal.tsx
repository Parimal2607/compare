"use client"

import { useRef } from "react"

export function EditCategoryModal({
  id,
  name,
  slug,
  action,
}: {
  id: string
  name: string
  slug: string
  action: (formData: FormData) => void
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null)

  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === e.currentTarget) {
      detailsRef.current?.removeAttribute("open")
    }
  }

  return (
    <details ref={detailsRef} className="inline-block">
      <summary className="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium text-violet-600 hover:bg-violet-50 transition-colors">
        Edit
      </summary>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
        onClick={handleBackdrop}
      >
        <div
          className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Edit Category</h3>
          <form action={action} className="space-y-3">
            <input type="hidden" name="id" value={id} />
            <div>
              <label className="text-xs font-medium text-gray-500">Name</label>
              <input
                name="name"
                defaultValue={name}
                required
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Slug</label>
              <input
                name="slug"
                defaultValue={slug}
                required
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </details>
  )
}

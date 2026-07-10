import Link from "next/link"

export const dynamic = "force-dynamic"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 shrink-0 border-r border-gray-200 bg-white p-6">
        <Link href="/admin" className="mb-8 block text-xl font-bold tracking-tight text-gray-900">
          CompareHub
          <span className="ml-1.5 rounded-md bg-gradient-to-r from-violet-600 to-blue-500 px-2 py-0.5 text-[10px] font-semibold text-white align-middle">Admin</span>
        </Link>
        <nav className="space-y-1">
          <NavItem href="/admin" label="Dashboard" />
          <NavItem href="/admin/categories" label="Categories" />
          <NavItem href="/admin/products" label="Products" />
          <NavItem href="/admin/comparisons" label="Comparisons" />
          <NavItem href="/admin/import" label="Import Product" />
        </nav>
        <div className="mt-12 border-t border-gray-100 pt-6">
          <Link href="/" className="text-xs text-gray-400 hover:text-violet-600 transition-colors">← Back to site</Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  )
}

function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-violet-50 hover:text-violet-700"
    >
      {label}
    </Link>
  )
}

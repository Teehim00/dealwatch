// components/Sidebar.tsx
import Link from 'next/link'

export default function Sidebar() {
  return (
    <aside className="h-screen w-64 bg-white shadow-md p-4 fixed left-0 top-0">
      <h1 className="text-2xl font-bold mb-6">DealWatch</h1>
      <nav className="space-y-4">
        <Link href="/dashboard" className="block text-blue-600 hover:underline">Dashboard</Link>
        <Link href="/deals" className="block text-blue-600 hover:underline">All Deals</Link>
        <Link href="/notifications" className="block text-blue-600 hover:underline">Notifications</Link>
        <Link href="/chat" className="block text-blue-600 hover:underline">Live Chat</Link>
        <Link href="/settings" className="block text-blue-600 hover:underline">Settings</Link>
      </nav>
    </aside>
  )
}

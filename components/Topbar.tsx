// components/Topbar.tsx
'use client'

export default function Topbar() {
  return (
    <header className="bg-white p-4 shadow-md flex justify-between items-center">
      <h2 className="text-lg font-semibold">Welcome back, Admin!</h2>
      <div className="flex items-center gap-4">
        <span className="text-gray-600">🔔</span>
        <span className="text-gray-600">👤 admin@dealwatch.com</span>
      </div>
    </header>
  )
}

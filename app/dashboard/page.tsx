// app/dashboard/page.tsx
'use client';

import Sidebar from '@/components/Sidebar';

export default function DashboardPage() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 w-full p-6">
        <h2 className="mb-4 text-3xl font-semibold">Dashboard</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow">📈 Live Price Tracker</div>
          <div className="rounded-lg bg-white p-6 shadow">🧾 Recent Deals</div>
          <div className="rounded-lg bg-white p-6 shadow">🔔 Notifications</div>
        </div>
      </main>
    </div>
  );
}

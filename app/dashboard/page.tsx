// app/dashboard/page.tsx
'use client';

import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

function StatCard({ title, value, icon }: { title: string; value: string; icon: string }) {
  return (
    <div className="flex items-center space-x-4 rounded-xl bg-white p-4 shadow">
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <>
      <Topbar />
      <div className="flex flex-1 flex-col gap-4 p-4 xl:flex-row">
        {/* LEFT */}
        <div className="hidden w-full xl:block xl:w-1/5">
          <div className="h-full rounded-md">
            <Sidebar />
          </div>
        </div>
        {/* RIGHT */}
        <div className="flex w-full flex-col gap-8 xl:w-2/2">
          <main className="flex flex-col bg-blue-700 p-6">
            <h2 className="mb-4 text-2xl font-bold text-white">📊 Dashboard Overview</h2>

            {/* สถิติภาพรวม */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard title="Tracked Deals" value="123" icon="🔥" />
              <StatCard title="Active Stores" value="25" icon="🏪" />
              <StatCard title="New Messages" value="8" icon="💬" />
              <StatCard title="Alerts Today" value="3" icon="🚨" />
            </div>

            {/* Section ข้อมูลเพิ่มเติม */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-xl bg-white p-6 shadow">
                <h3 className="mb-2 text-lg font-semibold">📈 Recent Price Changes</h3>
                <p className="text-gray-600">Coming soon...</p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow">
                <h3 className="mb-2 text-lg font-semibold">🔔 Recent Notifications</h3>
                <p className="text-gray-600">Coming soon...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

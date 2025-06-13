// app/dashboard/page.tsx
'use client';

import { useSessionContext, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { useEffect, useState } from 'react';
import PriceTrendChart from '@/components/PriceTrendChart';
import DateFilter from '@/components/dashboard/DateFilter';
import RecentNotifications from '@/components/RecentNotifications';

export default function DashboardPage() {
  const { session, isLoading } = useSessionContext();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const [dealCount, setDealCount] = useState(0);
  const [storeCount, setStoreCount] = useState(0);
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    if (!isLoading && !session) {
      router.replace('/loginPage');
    }
  }, [isLoading, session, router]);

  useEffect(() => {
    if (!session) return;
    (async () => {
      const { data: deals, error } = await supabase.from('deals').select('source, created_at');
      if (error) return console.error(error);

      let filtered = deals;
      if (dateRange === '7days') {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 7);
        filtered = deals.filter(d => new Date(d.created_at) >= cutoff);
      } else if (dateRange === '30days') {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 30);
        filtered = deals.filter(d => new Date(d.created_at) >= cutoff);
      }

      setDealCount(filtered.length);
      setStoreCount(new Set(filtered.map(d => d.source)).size);
    })();
  }, [session, dateRange, supabase]);

  // 4) ระหว่าง loading หรือยังไม่ login อย่า render UI
  if (isLoading || !session) return null;

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

  return (
    <>
      <Topbar />
      <div className="flex flex-1 flex-col gap-4 bg-white p-4 xl:flex-row">
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
            <div className="mb-4 flex justify-end">
              <DateFilter selected={dateRange} onChange={setDateRange} />
            </div>

            {/* สถิติภาพรวม */}
            <div className="mb-6 grid grid-cols-1 gap-4 text-gray-600 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard title="Tracked Deals" value={dealCount.toString()} icon="🔥" />
              <StatCard title="Active Stores" value={storeCount.toString()} icon="🏪" />
              <StatCard title="New Messages" value="8" icon="💬" />
              <StatCard title="Alerts Today" value="3" icon="🚨" />
            </div>

            {/* Section ข้อมูลเพิ่มเติม */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <PriceTrendChart />
              <RecentNotifications />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}



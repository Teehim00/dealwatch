// app/dashboard/page.tsx
'use client';

import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import PriceTrendChart from '@/components/PriceTrendChart';
import DateFilter from '@/components/dashboard/DateFilter';
// import RecentDeals from '@/components/RecentDeals';
import RecentNotifications from '@/components/RecentNotifications';
// import DealsTrendChart from '@/components/dashboard/DealsTrendChart';

export default function DashboardPage() {
  const [dealCount, setDealCount] = useState(0);
  const [storeCount, setStoreCount] = useState(0);
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    const fetchStats = async () => {
      // ดึงดีลทั้งหมด
      const { data: deals, error } = await supabase.from('deals').select('source');

      if (error) {
        console.error('❌ Supabase error:', error);
        return;
      }
      console.log('✅ Fetched deals:', deals); // 👈 ดูข้อมูลที่ได้

      setDealCount(deals.length);

      const uniqueStores = new Set(deals.map(d => d.source));
      setStoreCount(uniqueStores.size);
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      let fromDate;
      if (dateRange === '7days') {
        fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - 7);
      } else if (dateRange === '30days') {
        fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - 30);
      }

      const { data: deals, error } = await supabase.from('deals').select('source, created_at');

      if (error) {
        console.error('❌ Supabase error:', error);
        return;
      }

      const filtered = fromDate ? deals.filter(d => new Date(d.created_at) >= fromDate) : deals;

      setDealCount(filtered.length);
      const uniqueStores = new Set(filtered.map(d => d.source));
      setStoreCount(uniqueStores.size);
    };

    fetchStats();
  }, [dateRange]);

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
            <div className="mb-4 flex justify-end">
              <DateFilter selected={dateRange} onChange={setDateRange} />
            </div>

            {/* สถิติภาพรวม */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard title="Tracked Deals" value={dealCount.toString()} icon="🔥" />
              <StatCard title="Active Stores" value={storeCount.toString()} icon="🏪" />
              <StatCard title="New Messages" value="8" icon="💬" />
              <StatCard title="Alerts Today" value="3" icon="🚨" />
            </div>

            {/* Section ข้อมูลเพิ่มเติม */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <PriceTrendChart />
              <RecentNotifications />

              {/* <DealsTrendChart /> */}

              {/* <div className="rounded-xl bg-white p-6 shadow">
                <h3 className="mb-2 text-lg font-semibold">🔔 Recent Notifications</h3>
                <div className="text-gray-600">
                  <RecentDeals />
                </div>
              </div> */}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

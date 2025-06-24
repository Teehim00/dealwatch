// app/dashboard/page.tsx
'use client';

import { useSessionContext, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import NewDealsChart from '@/components/NewDealsChart';
import RecentNotifications from '@/components/RecentNotifications';

export default function DashboardPage() {
  const { session, isLoading } = useSessionContext();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const pathname = usePathname() ?? '';

  const [dealCount, setDealCount] = useState(0);
  const [storeCount, setStoreCount] = useState(0);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const [alertsCount, setAlertsCount] = useState(0);

  // redirect ถ้ายังไม่ login
  useEffect(() => {
    if (!isLoading && !session) router.replace('/loginPage');
  }, [isLoading, session, router]);

  // นับ deals & stores
  useEffect(() => {
    if (!session) return;
    (async () => {
      const { data: deals, error } = await supabase.from('deals').select('source, created_at');
      if (error) return console.error(error);
      setDealCount(deals.length);
      setStoreCount(new Set(deals.map(d => d.source)).size);
    })();
  }, [session, supabase]);

  // ฟังก์ชันดึง count ของข้อความใหม่และแจ้งเตือนวันนี้
  const refreshCounts = useCallback(async () => {
    if (!session) return;

    // ถ้าอยู่ในหน้า /chat หรือ /admin/chat ให้รีเซ็ตเป็น 0
    if (pathname.startsWith('/chat') || pathname.startsWith('/admin/chat')) {
      setNewMessageCount(0);
      setAlertsCount(0);
      return;
    }

    // หาบทบาทผู้ใช้
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();
    const isAdmin = profile?.role === 'admin';

    // New Messages
    let msgQ = supabase
      .from('messages')
      .select('id', { head: true, count: 'exact' })
      .eq('is_read', false)
      .eq('from_admin', !isAdmin);
    if (!isAdmin) msgQ = msgQ.eq('user_id', session.user.id);
    const { count: mc } = await msgQ;
    setNewMessageCount(mc || 0);

    // Alerts Today
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();
    const { count: ac } = await supabase
      .from('notifications')
      .select('id', { head: true, count: 'exact' })
      .gte('created_at', start)
      .lt('created_at', end);
    setAlertsCount(ac || 0);
  }, [session, supabase, pathname]);

  // เรียกครั้งแรก + subscribe realtime
  useEffect(() => {
    if (!session) return;
    refreshCounts();

    const msgSub = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages' }, payload => {
        if (payload.new.is_read !== payload.old.is_read) refreshCounts();
      })
      .subscribe();

    const notifSub = supabase
      .channel('public:notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, () => {
        refreshCounts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(msgSub);
      supabase.removeChannel(notifSub);
    };
  }, [session, supabase, refreshCounts]);

  if (isLoading || !session) return null;

  function StatCard({ title, value, icon }: { title: string; value: number; icon: string }) {
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
        <div className="hidden w-full xl:block xl:w-1/5">
          <Sidebar />
        </div>
        <div className="flex flex-1 flex-col gap-8 xl:w-4/5">
          <main className="flex flex-col bg-blue-700 p-6">
            <h2 className="mb-4 text-2xl font-bold text-white">📊 Dashboard Overview</h2>
            <div className="mb-6 grid grid-cols-1 gap-4 text-gray-600 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard title="Tracked Deals" value={dealCount} icon="🔥" />
              <StatCard title="Active Stores" value={storeCount} icon="🏪" />
              <StatCard title="New Messages" value={newMessageCount} icon="💬" />
              <StatCard title="Alerts Today" value={alertsCount} icon="🚨" />
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <NewDealsChart />
              <RecentNotifications />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

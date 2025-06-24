// components/Topbar.tsx
'use client';

import { useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Deals', href: '/deals' },
  { label: 'Favorites', href: '/favorites' },
  { label: 'Chat', href: '/chat' },
];

export default function Topbar() {
  const [username, setUsername] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  // const [email, setEmail] = useState<string>('');
  const supabase = useSupabaseClient();
  const { session } = useSessionContext();
  // const router = useRouter();
  const pathname = usePathname();
  const [notifCount, setNotifCount] = useState(0);

  console.log('notifCount', notifCount);
  // console.log('email', email);

  // ดึงอีเมลจาก session มาแสดง โดยแสดงทั้งหมดของ โปรวันนั้น
  // useEffect(() => {
  //   if (!session) return;
  //   setUsername(session.user.user_metadata.username);

  //   // 1) โหลด count ที่แท้จริง (ไม่จำกัดจำนวนแถว)
  //   supabase
  //     .from('notifications')
  //     .select('id', { count: 'exact', head: true }) // ✅ ใช้ head:true เพื่อให้ได้ count อย่างเดียว
  //     .then(({ count }) => setNotifCount(count || 0));

  //   // 1.1) (ตัวเลือก) โหลดรายการ 20 แถวล่าสุด
  //   supabase
  //     .from('notifications')
  //     .select('*')
  //     .order('created_at', { ascending: false }) // หรือใช้ 'id' ก็ได้ ถ้าไม่มี created_at
  //     .limit(20)
  //     .then(({ data }) => {
  //       // setNotifications(data); // ถ้ามี state เก็บ notifications
  //       console.log('20 รายการล่าสุด:', data);
  //     });

  //   // 2) realtime subscription
  //   const channel = supabase
  //     .channel('notifications')
  //     .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, () =>
  //       setNotifCount(c => c + 1)
  //     )
  //     .subscribe();

  //   return () => {
  //     supabase.removeChannel(channel);
  //   };
  // }, [session, supabase]);

  // ชุดนี้แสดงโปรแค่ 20 ก่อน
  useEffect(() => {
    if (!session) return;
    setUsername(session.user.user_metadata.username);

    // โหลดรายการสูงสุด 20 แถว แล้วนับจำนวนจริงที่ได้
    supabase
      .from('notifications')
      .select('*') // หรือเลือกเฉพาะ field ที่ต้องการ
      .order('created_at', { ascending: false }) // ใหม่สุดก่อน
      .limit(20)
      .then(({ data, error }) => {
        if (error) {
          console.error('Error loading notifications:', error);
          return;
        }
        setNotifCount(data?.length || 0); // ✅ นับจำนวนที่โหลดได้จริง
        // setNotifications(data); // (option) เก็บรายการไว้แสดงใน UI
      });

    // realtime subscription
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        () => setNotifCount(c => Math.min(c + 1, 20)) // ✅ จำกัดไม่เกิน 20
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/loginPage';
  };

  // useEffect(() => {
  //   const saved = localStorage.getItem('username');
  //   if (saved) setUsername(saved);
  // }, []);

  // const handleLogout = () => {
  //   localStorage.removeItem('username');
  //   router.push('/login');
  // };

  return (
    <>
      {/* HEADER */}
      <header className="flex items-center justify-between bg-white p-4 shadow-md">
        <h2 className="text-lg font-semibold text-gray-700">
          Welcome back, {username || 'Guest'}!
        </h2>

        <span className="mr-4 ml-auto text-gray-600 xl:hidden">🔔{notifCount || ''}</span>

        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-md border border-gray-300 bg-gray-600 p-2 hover:bg-gray-200 xl:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Notifications & User */}
          <span className="hidden text-gray-600 xl:inline">🔔{notifCount || ''}</span>
          <span className="hidden text-gray-600 xl:inline">👤 {username || 'No user'}</span>
          <button
            onClick={handleLogout}
            className="hidden rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600 xl:inline"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="absolute top-16 right-0 z-50 w-1/3 bg-white shadow-md xl:hidden">
          <nav className="flex flex-col space-y-2 p-4 text-gray-800">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  'block rounded px-4 py-2 transition hover:bg-gray-200',
                  pathname === item.href && 'bg-blue-500 font-semibold text-white'
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 border-t pt-2">
              <span className="block px-4 py-1 text-sm text-gray-600">
                👤 {username || 'No user'}
              </span>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="mt-1 w-full rounded bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

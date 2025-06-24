'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionContext, useSupabaseClient } from '@supabase/auth-helpers-react';
import UserChatBox from '@/components/chat/UserChatBox';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

export default function ChatPage() {
  const { session, isLoading } = useSessionContext();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [isCheckingRole, setIsCheckingRole] = useState(true);

  useEffect(() => {
    if (isLoading) return;

    if (!session) {
      router.replace('/loginPage');
      return;
    }

    const checkRole = async () => {
      const { data, error } = await supabase
        .from('profiles') // 👈 เปลี่ยนเป็นชื่อ table ที่เก็บ role ของคุณ
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('❌ Error loading role:', error.message);
        return;
      }

      const role = data?.role;
      if (role === 'admin') {
        router.replace('/admin/chat');
      } else {
        setIsCheckingRole(false); // ✅ แสดง chat ถ้าไม่ใช่ admin
      }
    };

    checkRole();
  }, [session, isLoading, supabase, router]);

  if (isLoading || isCheckingRole) return null;

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
        <div className="flex flex-1 items-start justify-center p-2">
          <div className="h-[900px] w-5/5 overflow-hidden rounded-md p-2 shadow-lg">
            <UserChatBox />
          </div>
        </div>
      </div>
    </>
  );
}

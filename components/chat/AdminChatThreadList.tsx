'use client';
import { useEffect, useState } from 'react';
import { useSessionContext, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';

type Thread = {
  user_id: string;
  created_at: string;
  username?: string;
};

export default function AdminChatThreadList() {
  const { session, isLoading } = useSessionContext();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [threads, setThreads] = useState<Thread[]>([]);

  useEffect(() => {
    if (isLoading) return;
    if (!session) router.replace('/loginPage');
  }, [session, isLoading, router]);

  useEffect(() => {
    if (!session) return;

    (async () => {
      const { data: messages } = await supabase
        .from('messages')
        .select('user_id, created_at')
        .order('created_at', { ascending: false });

      if (!messages) return;

      const seen = new Set<string>();
      const uniq = messages.filter(m => {
        if (seen.has(m.user_id)) return false;
        seen.add(m.user_id);
        return true;
      });

      const userIds = uniq.map(u => u.user_id);
      const { data: users } = await supabase
        .from('user_profiles')
        .select('id, username')
        .in('id', userIds);

      const merged = uniq.map(u => ({
        ...u,
        username: users?.find(usr => usr.id === u.user_id)?.username || '',
      }));

      setThreads(merged);
    })();
  }, [session]);

  if (isLoading || !session) return null;

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">🛠️ Admin Chat</h1>
      {threads.length === 0 ? (
        <p className="text-gray-600">ยังไม่มีหัวข้อแชท</p>
      ) : (
        <ul className="space-y-2">
          {threads.map(t => (
            <li key={t.user_id}>
              <button
                onClick={() => router.push(`/admin/chat/${t.user_id}`)}
                className="w-full rounded border p-4 text-left transition hover:bg-blue-50"
              >
                <div className="font-semibold">👤 ผู้ใช้: {t.username || t.user_id}</div>
                <div className="text-sm text-gray-500">
                  เริ่มแชท: {new Date(t.created_at).toLocaleString()}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

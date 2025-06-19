'use client';

import { useEffect, useState } from 'react';
import { useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';

type Notification = { id: string; message: string; created_at: string };

export default function RecentNotifications() {
  const supabase = useSupabaseClient();
  const { session } = useSessionContext();
  const [notes, setNotes] = useState<Notification[]>([]);

  useEffect(() => {
    if (!session) return;
    supabase
      .from('notifications')
      .select('id, message, created_at')
      .order('created_at', { ascending: false })
      .limit(5)
      .then(({ data }) => setNotes(data || []));
  }, [session, supabase]);

  return (
    <div className="flex h-full w-full flex-col rounded-xl bg-white p-6 shadow">
      <h3 className="mb-2 text-lg font-semibold text-gray-600">🔔 New Deals</h3>
      {notes.length === 0 ? (
        <p className="text-gray-600">ไม่มีการแจ้งเตือนล่าสุด</p>
      ) : (
        <ul className="max-h-80 list-disc overflow-y-auto pr-2 pl-5 text-sm text-gray-700">
          {notes.map(n => (
            <li key={n.id}>
              {n.message}
              <br />
              <span className="text-xs text-gray-500">
                {new Date(n.created_at).toLocaleString('th-TH')}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

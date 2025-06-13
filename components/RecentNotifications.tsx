'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Notification = {
  id: string;
  type: string;
  message: string;
  created_at: string;
};

export default function RecentNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching notifications:', error);
      } else {
        setNotifications(data);
      }
    };

    fetch();
  }, []);

  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h3 className="mb-2 text-lg font-semibold text-gray-600">🔔 New Deals</h3>
      {notifications.length === 0 ? (
        <p className="text-gray-600">ไม่มีการแจ้งเตือนล่าสุด</p>
      ) : (
        <ul className="max-h-64 list-disc overflow-y-auto pr-2 pl-5 text-sm text-gray-700">
          {notifications.map(n => (
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

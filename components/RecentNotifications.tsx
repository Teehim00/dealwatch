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
    const fetchNotifications = async () => {
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

    fetchNotifications();
  }, []);

  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h3 className="mb-2 text-lg font-semibold">🔔 Recent Notifications</h3>
      {notifications.length === 0 ? (
        <p className="text-gray-600">ไม่มีการแจ้งเตือนล่าสุด</p>
      ) : (
        <ul className="list-disc pl-5 text-sm text-gray-700 max-h-64 overflow-y-auto pr-2">
          {notifications.map((notif) => (
            <li key={notif.id}>
              {notif.message}
              <br />
              <span className="text-xs text-gray-500">
                {new Date(notif.created_at).toLocaleString('th-TH')}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

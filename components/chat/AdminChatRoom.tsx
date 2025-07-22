'use client';

import { useParams, useRouter } from 'next/navigation';
import { useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
import { useEffect, useState, useRef } from 'react';
import type { RealtimePostgresInsertPayload } from '@supabase/supabase-js';

type Message = {
  id: string;
  user_id: string;
  content: string;
  from_admin: boolean;
  is_read: boolean;
  created_at: string;
};

export default function AdminChatRoom() {
  const { userId } = useParams() as { userId: string };
  const { session, isLoading } = useSessionContext();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState('');
  const [input, setInput] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);

  // 1) Redirect if not logged in
  useEffect(() => {
    console.log('AdminChatRoom auth check:', { isLoading, session });
    if (!isLoading && !session) router.replace('/loginPage');
  }, [isLoading, session, router]);

  // 2) Load user's name
  useEffect(() => {
    console.log('Loading username for', userId);
    if (!userId) return;
    supabase
      .from('user_profiles')
      .select('username')
      .eq('id', userId)
      .single()
      .then(({ data, error }) => {
        console.log('Username load result:', { data, error });
        if (data?.username) setUsername(data.username);
      });
  }, [userId, supabase]);

  // 3) mark unread user→admin messages as read
  useEffect(() => {
    console.log('AdminChatRoom markAsRead start');
    if (isLoading || !session) return;

    const markAsRead = async () => {
      console.log('Fetching unread messages for user', userId);
      const { data: unread, error: fetchErr } = await supabase
        .from('messages')
        .select('id')
        .eq('user_id', userId)
        .eq('from_admin', false)
        .eq('is_read', false);

      console.log('Fetch unread result:', { unread, fetchErr });
      if (fetchErr) return;

      const ids = unread?.map(m => m.id) || [];
      console.log('IDs to mark read:', ids);
      if (!ids.length) return;

      const { data: updated, error: updateErr } = await supabase
        .from('messages')
        .update({ is_read: true })
        .in('id', ids)
        .select('id, is_read');

      console.log('Mark-as-read result:', { updated, updateErr });
    };

    markAsRead();
  }, [session, userId, isLoading, supabase]);

  // 4) Load chat history
  useEffect(() => {
    console.log('Loading chat history for', userId);
    if (!session) return;
    (async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });
      console.log('Fetch history result:', { data, error });
      if (error) return;
      setMessages(data || []);
      setTimeout(() => chatRef.current?.scrollTo(0, chatRef.current.scrollHeight), 100);
    })();
  }, [session, userId, supabase]);

  // 5) Subscribe to new messages
  useEffect(() => {
    console.log('Subscribing to new messages for', userId);
    if (!session) return;
    const channel = supabase
      .channel(`admin-messages-${userId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `user_id=eq.${userId}` },
        async (payload: RealtimePostgresInsertPayload<Message>) => {
          const newMsg = payload.new as Message;
          // แสดงข้อความใหม่
          console.log('Realtime new message payload:', payload);
          setMessages(prev => [...prev, newMsg]);
          setTimeout(() => chatRef.current?.scrollTo(0, chatRef.current.scrollHeight), 100);
          // ถ้าเป็นข้อความจาก user (from_admin=false) และยังไม่อ่าน ให้ mark-as-read
          if (!newMsg.from_admin && !newMsg.is_read) {
            await supabase.from('messages').update({ is_read: true }).eq('id', newMsg.id);
            console.log('Marked realtime message as read:', newMsg.id);
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Unsubscribing channel');
      supabase.removeChannel(channel);
    };
  }, [session, userId, supabase]);

  // 6) Send reply
  const send = async () => {
    console.log('Sending reply:', input);
    if (!session || !input.trim()) return;
    const { data, error } = await supabase.from('messages').insert({
      user_id: userId,
      content: input,
      from_admin: true,
    });
    console.log('Insert reply result:', { data, error });
    setInput('');
  };

  if (isLoading || !session) return null;

  return (
    <div className="flex h-full flex-col bg-gray-50 p-4">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">แชทกับ {username || userId}</h2>
      <div ref={chatRef} className="flex-1 overflow-y-auto rounded border bg-white p-4">
        <div className="flex flex-col space-y-3">
          {messages.map(m => (
            <div
              key={m.id}
              className={`max-w-[70%] rounded p-2 ${
                m.from_admin
                  ? 'self-end bg-blue-100 text-gray-700'
                  : 'self-start bg-gray-100 text-gray-600'
              }`}
            >
              <div className="text-sm font-bold">{m.from_admin ? 'Admin' : username}</div>
              <div>{m.content}</div>
              <div className="mt-1 text-right text-xs text-gray-400">
                {new Date(m.created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex">
        <input
          type="text"
          className="flex-1 rounded-l border px-4 py-2 text-gray-700"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="พิมพ์ข้อความที่นี่..."
        />
        <button onClick={send} className="rounded-r bg-blue-600 px-4 py-2 text-white">
          ส่ง
        </button>
      </div>
    </div>
  );
}

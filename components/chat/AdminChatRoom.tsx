'use client';
import { useParams, useRouter } from 'next/navigation';
import { useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
import { useEffect, useState, useRef } from 'react';

type Message = {
  id: string;
  user_id: string;
  content: string;
  from_admin: boolean;
  created_at: string;
};

export default function AdminChatRoom() {
  const { userId } = useParams() as { userId: string };
  const { session, isLoading } = useSessionContext();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!session) router.replace('/loginPage');
  }, [session, isLoading]);

  useEffect(() => {
    supabase
      .from('user_profiles')
      .select('username')
      .eq('id', userId)
      .single()
      .then(({ data }) => {
        if (data?.username) setUsername(data.username);
      });
  }, [userId]);

  useEffect(() => {
    supabase
      .from('messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at')
      .then(({ data }) => {
        if (data) setMessages(data);
      });

    const channel = supabase
      .channel('admin-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `user_id=eq.${userId}`,
        },
        payload => {
          const newMsg = payload.new as Message;
          setMessages(prev => [...prev, newMsg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const send = async () => {
    if (!input.trim()) return;
    await supabase.from('messages').insert({
      user_id: userId,
      content: input,
      from_admin: true,
    });
    setInput('');
  };

  if (isLoading || !session) return null;

  return (
    <div className="flex h-full flex-col bg-gray-50 p-4">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">แชทกับ {username || userId}</h2>
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto rounded border border-black bg-white p-4"
      >
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
              <div className="text-right text-xs text-gray-400">
                {new Date(m.created_at).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex">
        <input
          type="text"
          className="flex-1 rounded-l border px-4 py-2 text-gray-600"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="พิมพ์ข้อความที่นี่..."
        />
        <button className="rounded-r bg-blue-600 px-4 py-2 text-white" onClick={send}>
          ส่ง
        </button>
      </div>
    </div>
  );
}

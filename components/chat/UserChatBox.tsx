'use client';
import { useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

type Message = {
  id: string;
  user_id: string;
  content: string;
  from_admin: boolean;
  created_at: string;
};

export default function UserChatBox() {
  const { session, isLoading } = useSessionContext();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!session) router.replace('/loginPage');
  }, [session, isLoading, router]);

  useEffect(() => {
    if (!session) return;
    const uid = session.user.id;

    const loadHistory = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', uid)
        .order('created_at');
      if (data) setMessages(data);
    };

    loadHistory();
  }, [session]);

  useEffect(() => {
    if (!session) return;
    const uid = session.user.id;

    const channel = supabase
      .channel(`user-messages-${uid}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        payload => {
          const newMsg = payload.new as Message;
          if (newMsg.user_id === uid) {
            setMessages(prev => [...prev, newMsg]);
            setTimeout(() => {
              chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
            }, 100);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

  const send = async () => {
    if (!input.trim()) return;
    await supabase.from('messages').insert({
      user_id: session!.user.id,
      content: input,
      from_admin: false,
    });
    setInput('');
  };

  if (isLoading || !session) return null;

  return (
    <div className="flex h-full flex-col bg-gray-50 p-4">
      <h2 className="mb-4 border-b pb-2 text-2xl font-semibold text-gray-800">แชทกับ Admin</h2>
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto rounded-lg border border-black bg-white p-4 shadow-inner"
      >
        <div className="flex flex-col space-y-5">
          {messages.map(m => (
            <div
              key={m.id}
              className={`chat max-w-[70%] rounded-xl p-3 shadow-sm ${
                m.from_admin
                  ? 'self-start bg-blue-100 text-gray-700'
                  : 'self-end bg-green-200 text-gray-700'
              }`}
            >
              <div className="chat-header mb-1 font-medium">{m.from_admin ? 'Admin' : 'คุณ'}</div>
              <div className="chat-bubble whitespace-pre-wrap">{m.content}</div>
              <div className="mt-1 text-right text-xs text-gray-500">
                {new Date(m.created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          className="flex-1 rounded-lg border border-black px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          placeholder="พิมพ์ข้อความที่นี่..."
        />
        <button onClick={send} className="rounded-lg bg-blue-600 px-6 py-2 text-white">
          ส่ง
        </button>
      </div>
    </div>
  );
}

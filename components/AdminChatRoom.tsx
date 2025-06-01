//components/AdminChatRoom.tsx
'use client';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type ChatMessage = {
  user: string;
  message: string;
  timestamp: string;
};

let socket: Socket;

export default function AdminChatRoom() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    socket = io('http://localhost:3001');

    socket.on('message', (msg: ChatMessage) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on('chatHistory', (history: ChatMessage[]) => {
      setMessages(history);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;
    const chat: ChatMessage = {
      user: 'Admin', // 🛡️ ชื่อผู้ตอบกลับ
      message: message.trim(),
      timestamp: new Date().toISOString(),
    };
    socket.emit('message', chat);
    setMessage('');
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border rounded bg-white shadow">
      <h2 className="text-xl font-bold mb-2">🛡️ Admin Chat</h2>
      <div className="mb-2 h-64 overflow-y-auto rounded border p-2 bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className="text-sm mb-1">
            <strong className={msg.user === 'Admin' ? 'text-red-600' : 'text-blue-600'}>
              {msg.user}
            </strong>
            : {msg.message}
            <span className="ml-2 text-xs text-gray-400">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border p-2 rounded"
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="พิมพ์ข้อความตอบกลับ..."
        />
        <button
          onClick={sendMessage}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          ส่ง
        </button>
      </div>
    </div>
  );
}

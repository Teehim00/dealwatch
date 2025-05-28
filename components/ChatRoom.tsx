//components/ChatRoom.tsx
// 'use client';
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { io } from 'socket.io-client';

// const socket = io('http://localhost:3001');

// export default function ChatRoom() {
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState<string[]>([]);
//   const [username, setUsername] = useState('');
//   const router = useRouter();

//   useEffect(() => {
//     const saved = localStorage.getItem('username');
//     if (!saved) {
//       router.push('/login');
//     } else {
//       setUsername(saved);
//     }

//     socket.on('message', (msg: string) => {
//       setMessages(prev => [...prev, msg]);
//     });
//   }, []);

//   const sendMessage = () => {
//     socket.emit('message', `${username}: ${message}`);
//     setMessage('');
//   };

//   return (
//     <div>
//       <h2 className="mb-2 text-2xl font-bold">💬 Live Chat</h2>
//       <div className="mb-2 h-64 overflow-y-auto rounded border bg-white p-2">
//         {messages.map((msg, i) => (
//           <p key={i} className="text-sm">
//             {msg}
//           </p>
//         ))}
//       </div>
//       <div className="flex gap-2">
//         <input
//           value={message}
//           onChange={e => setMessage(e.target.value)}
//           onKeyDown={e => e.key === 'Enter' && sendMessage()}
//           className="flex-1 rounded border p-2"
//           placeholder="Type your message..."
//         />
//         <button
//           onClick={sendMessage}
//           className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }





'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';

type ChatMessage = {
  user: string;
  message: string;
  timestamp: string;
};

let socket: Socket;

export default function ChatRoom() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [username, setUsername] = useState('');
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('username');
    if (!saved) {
      router.push('/login');
    } else {
      setUsername(saved);
      // เชื่อมต่อ socket เมื่อมี username
      socket = io('http://localhost:3001');

      // รับข้อความใหม่
      socket.on('message', (msg: ChatMessage) => {
        setMessages(prev => [...prev, msg]);
      });

      // รับประวัติแชท
      socket.on('chatHistory', (history: ChatMessage[]) => {
        setMessages(history);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [router]);

  const sendMessage = () => {
    if (!message.trim()) return;
    const chat: ChatMessage = {
      user: username,
      message: message.trim(),
      timestamp: new Date().toISOString(),
    };
    socket.emit('message', chat);
    setMessage('');
  };

  return (
    <div>
      <h2 className="mb-2 text-2xl font-bold">💬 Live Chat</h2>
      <div className="mb-2 h-64 overflow-y-auto rounded border bg-white p-2">
        {messages.map((msg, i) => (
          <div key={i} className="mb-1 text-sm">
            <span className="font-semibold text-blue-600">{msg.user}</span>:{' '}
            <span>{msg.message}</span>{' '}
            <span className="ml-2 text-xs text-gray-400">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          className="flex-1 rounded border p-2"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}









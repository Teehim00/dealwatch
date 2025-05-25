// 'use client';

// import { useEffect, useState } from 'react';
// import { io } from 'socket.io-client';

// // 👉 ชี้ไปที่ backend ของคุณ
// const socket = io('http://localhost:3001');

// export default function Chat() {
//   const [message, setMessage] = useState('');
//   const [chatLog, setChatLog] = useState<string[]>([]);

//   useEffect(() => {
//     // ✅ รับข้อความจาก server
//     socket.on('message', (msg: string) => {
//       setChatLog(prev => [...prev, msg]);
//     });

//     return () => {
//       socket.off('message');
//     };
//   }, []);

//   const sendMessage = () => {
//     if (message.trim() === '') return;
//     socket.emit('message', message); // ✅ ส่งข้อความไปหา server
//     setMessage('');
//   };

//   return (
//     <div className="mx-auto max-w-md rounded border p-4">
//       <div className="mb-2 h-60 overflow-y-auto border-b pb-2">
//         {chatLog.map((msg, idx) => (
//           <div key={idx} className="text-sm">
//             {msg}
//           </div>
//         ))}
//       </div>
//       <div className="flex gap-2">
//         <input
//           value={message}
//           onChange={e => setMessage(e.target.value)}
//           onKeyDown={e => e.key === 'Enter' && sendMessage()}
//           className="flex-1 rounded border px-2 py-1"
//           placeholder="พิมพ์ข้อความ..."
//         />
//         <button onClick={sendMessage} className="rounded bg-blue-600 px-3 py-1 text-white">
//           ส่ง
//         </button>
//       </div>
//     </div>
//   );
// }

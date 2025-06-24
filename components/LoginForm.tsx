// // components/LoginForm.tsx
// 'use client';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';

// export default function LoginForm() {
//   const [name, setName] = useState('');
//   const router = useRouter();

//   const handleLogin = () => {
//     if (name.trim()) {
//       localStorage.setItem('username', name);
//       router.push('/chat');
//     }
//   };

//   return (
//     <div className="mx-auto mt-10 max-w-sm rounded bg-white p-6 shadow">
//       <h2 className="mb-4 text-2xl font-bold">🔐 เข้าสู่ระบบ</h2>
//       <input
//         className="mb-4 w-full border p-2"
//         placeholder="กรอกชื่อของคุณ"
//         value={name}
//         onChange={e => setName(e.target.value)}
//       />
//       <button onClick={handleLogin} className="w-full rounded bg-blue-600 px-4 py-2 text-white">
//         เข้าสู่ระบบ
//       </button>
//     </div>
//   );
// }

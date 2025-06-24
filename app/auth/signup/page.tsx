// app/auth/singup/pang.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

export default function SignUpPage() {
  const supabase = useSupabaseClient();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUsername] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // 1) สมัครสมาชิกกับ Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username: userName }, // จะไปเก็บใน auth.users.user_metadata
      },
    });

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    // 2) เขียนแถวใหม่ลงตาราง profiles (ใช้ user.id เป็น primary key ของเรา)
    if (data.user) {
      
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        username: userName,
        role: 'user',
        created_at: new Date(),
      });

      if (profileError) {
        console.error('❌ Error inserting profile:', JSON.stringify(profileError, null, 2));
        setErrorMsg('เกิดข้อผิดพลาดขณะบันทึกข้อมูลผู้ใช้');
        return;
      }
    }

    // 3) ถ้าไม่มี error ทั้งคู่ → ไปหน้า login
    router.push('/loginPage');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSignUp} className="w-full max-w-md rounded-xl bg-white p-8 shadow">
        <h1 className="mb-4 text-center text-2xl font-bold text-gray-500">สมัครสมาชิก</h1>

        {errorMsg && (
          <div className="mb-2 rounded bg-red-100 p-2 text-sm text-red-700">{errorMsg}</div>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-500">UserName</label>
          <input
            type="text"
            required
            value={userName}
            onChange={e => setUsername(e.target.value)}
            className="mt-1 w-full rounded border px-3 py-2 text-gray-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-500">อีเมล</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="mt-1 w-full rounded border px-3 py-2 text-gray-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-500">รหัสผ่าน</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="mt-1 w-full rounded border px-3 py-2 text-gray-400"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          สมัครสมาชิก
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          เป็นสมาชิกแล้ว?{' '}
          <a href="/loginPage" className="text-blue-600 hover:underline">
            เข้าสู่ระบบ
          </a>
        </p>
      </form>
    </div>
  );
}

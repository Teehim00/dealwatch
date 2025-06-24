// /app/loginPage/page.tsx
'use client';

import LoginPageForm from '@/components/LoginPageForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow">
          <h1 className="mb-4 text-center text-2xl font-bold text-gray-600">
            เข้าสู่ระบบ DealWatch
          </h1>
          <LoginPageForm />
          <p className="mt-4 text-center text-sm text-gray-600">
            ยังไม่มีบัญชี?{' '}
            <Link href="/auth/signup" className="text-blue-600 hover:underline">
              สมัครสมาชิก
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

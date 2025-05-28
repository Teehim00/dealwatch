// components/LoginForm.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const [name, setName] = useState('')
  const router = useRouter()

  const handleLogin = () => {
    if (name.trim()) {
      localStorage.setItem('username', name)
      router.push('/chat')
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">🔐 เข้าสู่ระบบ</h2>
      <input
        className="border p-2 w-full mb-4"
        placeholder="กรอกชื่อของคุณ"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        เข้าสู่ระบบ
      </button>
    </div>
  )
}

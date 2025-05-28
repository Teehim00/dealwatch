'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Deals', href: '/deals' },
  { label: 'Stores', href: '/stores' },
  { label: 'Chat', href: '/chat' },
];

export default function Topbar() {
  const [username, setUsername] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const saved = localStorage.getItem('username');
    if (saved) setUsername(saved);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('username');
    router.push('/login');
  };

  return (
    <>
      {/* HEADER */}
      <header className="flex items-center justify-between bg-white p-4 shadow-md">
        <h2 className="text-lg font-semibold">Welcome back, {username || 'Guest'}!</h2>

        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-md border border-gray-300 bg-gray-100 p-2 hover:bg-gray-200 lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Notifications & User */}
          <span className="hidden text-gray-600 lg:inline">🔔</span>
          <span className="hidden text-gray-600 lg:inline">👤 {username || 'No user'}</span>
          <button
            onClick={handleLogout}
            className="hidden rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600 xl:inline"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="absolute top-16 right-0 z-50 w-1/3 bg-white shadow-md lg:hidden">
          <nav className="flex flex-col space-y-2 p-4">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  'block rounded px-4 py-2 transition hover:bg-gray-200',
                  pathname === item.href && 'bg-blue-500 font-semibold text-white'
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 border-t pt-2">
              <span className="block px-4 py-1 text-sm text-gray-600">
                👤 {username || 'No user'}
              </span>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="mt-1 w-full rounded bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

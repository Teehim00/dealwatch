// components/Sidebar.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Deals', href: '/deals' },
  { label: 'Favorites', href: '/favorites' },
  { label: 'Chat', href: '/chat' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="top-0 left-0 flex h-full w-64 flex-col bg-white p-4 shadow-md">
      <h1 className="mb-6 text-2xl font-bold text-gray-600">📦 DealWatch</h1>
      <nav className="space-y-2">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'block rounded px-4 py-2 text-gray-600 transition hover:bg-gray-800',
              pathname === item.href && 'bg-blue-500 font-semibold text-white'
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

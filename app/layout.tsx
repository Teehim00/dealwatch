// app/layout.tsx

import './globals.css';
import { Inter } from 'next/font/google';
import SupabaseProvider from '@/components/SupabaseProvider';
import InitUserToDatabase from '@/components/InitUserToDatabase'; // ✅ import component

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className={inter.className}>
        <SupabaseProvider>
          <InitUserToDatabase /> {/* ✅ sync username ทุกครั้งที่ login */}
          {children}
        </SupabaseProvider>
      </body>
    </html>
  );
}

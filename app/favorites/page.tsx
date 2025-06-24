// app/favorites/page.tsx
'use client';

import { useSessionContext, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Topbar from '@/components/Topbar';
import Sidebar from '@/components/Sidebar';
import DealCard from '@/components/DealCard';

type Deal = {
  id: string;
  name: string;
  source: string;
  price: number | string;
  image: string;
  link: string;
};

type FavoriteRow = {
  id: string;
  deals: Deal[];
};

type FavoriteDeal = {
  favId: string; // รหัสในตาราง favorites
  id: string; // รหัสดีล
  name: string;
  source: string;
  price: number;
  image: string;
};

export default function FavoritesPage() {
  const { session, isLoading } = useSessionContext();
  const supabase = useSupabaseClient();
  const router = useRouter();
  console.log('ห', session);

  const [favorites, setFavorites] = useState<FavoriteDeal[]>([]);
  const [loading, setLoading] = useState(true);

  // ถ้ายังไม่ล็อกอิน → redirect
  useEffect(() => {
    if (!isLoading && !session) {
      router.replace('/loginPage');
    }
  }, [isLoading, session, router]);

  // ดึง favorites + ข้อมูลดีล
  useEffect(() => {
    if (!session) return;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('favorites')
        // เลือก id ของ row ใน favorites และข้อมูล deal
        .select('id, deals(id, name, source, price, image, link)')
        .eq('user_id', session.user.id);

      if (error) {
        console.error('❌ Supabase error:', error);
        setFavorites([]);
        setLoading(false);
        return;
      }

      // กรองเฉพาะแถวที่มี deals
      const normalized = (data || [])
        .filter((row): row is FavoriteRow & { deals: Deal } => row.deals !== null)
        .map(row => ({
          favId: row.id,
          id: row.deals.id,
          name: row.deals.name,
          source: row.deals.source,
          price: Number(row.deals.price),
          image: row.deals.image,
          link: row.deals.link,
        }));

      // กรองดีลซ้ำ
      const unique = normalized.filter((f, idx, arr) => arr.findIndex(x => x.id === f.id) === idx);

      setFavorites(unique);
      setLoading(false);
    })();
  }, [session, supabase]);

  // ฟังก์ชันลบ favorite
  const handleRemove = async (favId: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าจะลบดีลนี้จากรายการโปรด?')) return;
    const { error } = await supabase.from('favorites').delete().eq('id', favId);

    if (error) {
      console.error('❌ Delete favorite error:', error);
      alert('เกิดข้อผิดพลาดในการลบ');
    } else {
      // อัปเดต state ทันที
      setFavorites(prev => prev.filter(f => f.favId !== favId));
      alert('✅ ลบออกจากรายการโปรดแล้ว');
    }
  };

  if (isLoading || !session || loading) {
    return <p className="p-4">กำลังโหลด...</p>;
  }

  return (
    <>
      <Topbar />
      <div className="flex flex-col gap-4 bg-white p-4 xl:flex-row">
        <div className="hidden xl:block xl:w-1/5">
          <Sidebar />
        </div>
        <main className="flex-1 space-y-4">
          <h2 className="text-2xl font-bold text-gray-700">❤️ รายการโปรดของคุณ</h2>

          {favorites.length === 0 ? (
            <p className="text-gray-600">คุณยังไม่มีดีลโปรด</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {favorites.map(deal => (
                <div key={deal.favId} className="relative">
                  <DealCard
                    id={deal.id}
                    title={deal.name}
                    store={deal.source}
                    price={deal.price}
                    image={deal.image}
                  />
                  <button
                    onClick={() => handleRemove(deal.favId)}
                    className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                    aria-label="ลบจากรายการโปรด"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}

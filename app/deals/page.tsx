// app/deals/page.tsx
'use client';

import { useSessionContext, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { useEffect, useState } from 'react';
import DealCard from '@/components/DealCard';
import DealsFilter from '@/components/DealsFilter';

type Deal = {
  id: string;
  title: string;
  store: string;
  price: number;
  image: string;
  link: string;
  description: string;
};

const ITEMS_PER_PAGE = 9;

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [search, setSearch] = useState('');
  const [storeFilter, setStoreFilter] = useState('');
  const [sort, setSort] = useState('');
  const [loading, setLoading] = useState(true); // ✅ Loading State
  const [currentPage, setCurrentPage] = useState(1);
  const { session, isLoading } = useSessionContext();
  const router = useRouter();
  const supabase = useSupabaseClient();

  console.log('sort', sort);
  console.log('session', session);
  console.log('isLoading', isLoading);
  console.log('router', router);

  // 1️⃣ Redirect ถ้ายังไม่ล็อกอิน เมื่อโหลด session เสร็จ
  useEffect(() => {
    if (!isLoading && !session) {
      router.replace('/loginPage');
    }
  }, [isLoading, session, router]);

  // 2️⃣ Fetch deals เมื่อ session พร้อม
  useEffect(() => {
    if (!session) return;
    const fetchDeals = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('deals').select('*');
      if (!error && data) {
        setDeals(
          data.map(d => ({
            id: d.id,
            name: d.name,
            title: d.name, // ← เพิ่ม title ที่เท่ากับ name
            store: d.source,
            price: Number(d.price),
            image: d.image,
            link: d.link,
            description: d.description,
          }))
        );
      }
      setLoading(false);
    };
    fetchDeals();
  }, [session, supabase]);

  if (isLoading || !session) return null;

  const filteredDeals = deals
    .filter(
      deal =>
        (search === '' || deal.title.toLowerCase().includes(search.toLowerCase())) &&
        (storeFilter === '' || deal.store === storeFilter)
    )
    .sort((a, b) => {
      if (sort === 'lowToHigh') return a.price - b.price;
      if (sort === 'highToLow') return b.price - a.price;
      return 0;
    });

  const totalPages = Math.ceil(filteredDeals.length / ITEMS_PER_PAGE);
  const paginatedDeals = filteredDeals.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const storeList = [...new Set(deals.map(d => d.store))].filter(Boolean);

  return (
    <>
      <Topbar />
      <div className="flex flex-1 flex-col gap-4 bg-white p-4 xl:flex-row">
        {/* LEFT */}
        <div className="hidden w-full xl:block xl:w-1/5">
          <div className="h-full rounded-md">
            <Sidebar />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex w-full flex-col gap-8 xl:w-2/2">
          <div className="p-4">
            <h2 className="mb-4 text-2xl font-bold text-gray-700">🔥 โปรโมชันล่าสุด</h2>

            <DealsFilter
              search={search}
              store={storeFilter}
              sort={sort}
              onSearchChange={setSearch}
              onStoreChange={setStoreFilter}
              onSortChange={setSort}
              stores={storeList}
            />

            {/* ✅ Loading State */}
            {loading ? (
              <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
            ) : paginatedDeals.length === 0 ? (
              // ✅ Empty State
              <p className="text-gray-500">ไม่พบดีลที่ตรงกับเงื่อนไข</p>
            ) : (
              <>
                <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {paginatedDeals.map(deal => (
                    <DealCard
                      key={deal.id}
                      id={deal.id}
                      title={deal.title}
                      store={deal.store}
                      price={deal.price}
                      image={deal.image}
                   
                    />
                  ))}
                </div>

                {/* ✅ Pagination */}
                <div className="mt-6 flex justify-center space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`rounded px-4 py-2 text-sm font-medium ${
                        currentPage === i + 1
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

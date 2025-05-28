// app/deals/page.tsx
'use client';

import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { useEffect, useState } from 'react';
import DealCard from '@/components/DealCard';
import DealsFilter from '@/components/DealsFilter';

type Deal = {
  id: number;
  title: string;
  store: string;
  price: number;
};

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [search, setSearch] = useState('');
  const [storeFilter, setStoreFilter] = useState('');
  const [sort, setSort] = useState('');
  const [loading, setLoading] = useState(true); // ✅ Loading State
  console.log('sort', sort);

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:3001/api/scrape');
        const data = await res.json();
        setDeals(data);
      } catch (err) {
        console.error('Error fetching deals:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

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

  const storeList = [...new Set(deals.map(d => d.store))];

  return (
    <>
      <Topbar />
      <div className="flex flex-1 flex-col gap-4 p-4 xl:flex-row">
        {/* LEFT */}
        <div className="hidden w-full xl:block xl:w-1/5">
          <div className="h-full rounded-md">
            <Sidebar />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex w-full flex-col gap-8 xl:w-2/2">
          <div className="p-4">
            <h2 className="mb-4 text-2xl font-bold">🔥 โปรโมชันล่าสุด</h2>

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
            ) : filteredDeals.length === 0 ? (
              // ✅ Empty State
              <p className="text-gray-500">ไม่พบดีลที่ตรงกับเงื่อนไข</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredDeals.map(deal => (
                  <DealCard key={deal.id} {...deal} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

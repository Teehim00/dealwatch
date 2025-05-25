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

  useEffect(() => {
    const fetchDeals = async () => {
      const res = await fetch('http://localhost:3001/api/deals');
      const data = await res.json();
      setDeals(data);
    };
    fetchDeals();
  }, []);

  const filteredDeals = deals.filter(deal => {
    return (
      (search === '' || deal.title.toLowerCase().includes(search.toLowerCase())) &&
      (storeFilter === '' || deal.store === storeFilter)
    );
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
              onSearchChange={setSearch}
              onStoreChange={setStoreFilter}
              stores={storeList}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredDeals.map(deal => (
                <DealCard key={deal.id} {...deal} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

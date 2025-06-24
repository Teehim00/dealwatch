'use client';

import { useSessionContext, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Topbar from '@/components/Topbar';
import Sidebar from '@/components/Sidebar';
import Image from 'next/image';
// import PriceTrendChart from '@/components/PriceTrendChart';

interface Deal {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  link: string;
  created_at: string;
  source: string;
}

export default function DealDetailPage() {
  const { id } = useParams() as { id: string };
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);

  const { session, isLoading } = useSessionContext();
  const supabase = useSupabaseClient();
  const router = useRouter();

  // ถ้าโหลด session เสร็จแล้ว ยังไม่มี session → redirect
  useEffect(() => {
    if (!isLoading && !session) {
      router.replace('/loginPage');
    }
  }, [isLoading, session, router]);

  // 🛍️ ดึงข้อมูลดีลตาม id
  useEffect(() => {
    if (!session) return;
    // ทำเป็น async function ภายใน useEffect
    const fetchDeal = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('deals').select('*').eq('id', id).single();

        if (error) {
          console.error('❌ Error fetching deal:', error);
        } else {
          setDeal(data ?? null);
        }
      } catch (err) {
        console.error('❌ Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeal();
  }, [session, supabase, id]);

  // 5) ช่วงรอโหลด session หรือ fetchDeal
  if (isLoading || !session || loading) {
    return <p className="p-4">กำลังโหลดข้อมูล...</p>;
  }

  if (!deal) {
    return <p className="p-4 text-red-500">ไม่พบดีลนี้</p>;
  }

  // ❤️ เพิ่มในรายการโปรด
  const handleAddFavorite = async () => {
    const { error } = await supabase.from('favorites').insert({
      user_id: session.user.id,
      deal_id: deal.id,
    });

    if (error) {
      console.error('❌ Favorite insert error:', error);
      alert('❌ เกิดข้อผิดพลาดในการบันทึก');
    } else {
      alert('✅ บันทึกดีลโปรดแล้ว');
    }
  };

  return (
    <>
      <Topbar />
      <div className="flex flex-1 flex-col gap-4 bg-white p-4 xl:flex-row">
        {/* ไซด์บาร์ */}
        <div className="hidden w-full xl:block xl:w-1/5">
          <Sidebar />
        </div>

        {/* เนื้อหาหลัก */}
        <div className="flex w-full flex-col gap-8 xl:w-2/2">
          <div className="rounded-xl bg-white p-6 shadow">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* รูป */}
              <Image
                src={deal.image}
                alt={deal.name}
                width={600}
                height={400}
                className="rounded-xl object-contain"
              />

              {/* รายละเอียด */}
              <div>
                <h2 className="mb-2 text-2xl font-bold text-gray-600">{deal.name}</h2>
                <p className="mb-4 text-xl font-semibold text-green-600">
                  {deal.price.toLocaleString()} ฿
                </p>
                <p className="text-sm whitespace-pre-line text-gray-600">{deal.description}</p>

                <div className="mt-6 flex gap-4">
                  <a
                    href={deal.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    ไปยังเว็บไซต์ต้นทาง
                  </a>
                  <button
                    onClick={handleAddFavorite}
                    className="inline-block rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    ❤️ เพิ่มในรายการโปรด
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* <PriceTrendChart dealId={deal.id} /> */}
        </div>
      </div>
    </>
  );
}

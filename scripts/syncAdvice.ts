// scripts/syncAdvice.ts
import 'dotenv/config';
import { scrapeAdvicePromotions } from '@/backend/scrapers/adviceScraper';
import { supabase } from '../lib/supabase';

async function syncAdviceDeals() {
  console.log('🚀 เริ่มดึงข้อมูลโปรโมชั่นจาก Advice...');

  const deals = await scrapeAdvicePromotions();
  console.log(`🎯 พบโปรโมชั่นทั้งหมด: ${deals.length} รายการ`);

  for (const deal of deals) {
    const { name, link, image, description } = deal;

    // ตรวจสอบว่ามีอยู่ใน DB หรือยัง
    const { data: existing, error: selectError } = await supabase
      .from('deals')
      .select('id')
      .eq('link', link)
      .single();

    if (existing) {
      console.log(`⚠️ มีอยู่แล้วใน DB: ${name}`);
      continue;
    }

    // Insert ใหม่
    const { error: insertError } = await supabase.from('deals').insert([
      {
        name,
        link,
        image,
        description,
        source: 'advice', // เผื่อในอนาคตเพิ่มเว็บอื่น
      },
    ]);

    if (insertError) {
      console.error(`❌ Insert ล้มเหลว: ${name}`, insertError);
    } else {
      console.log(`✅ บันทึกโปรโมชั่น: ${name}`);
    }
  }

  console.log('🎉 เสร็จสิ้นการ Sync แล้ว!');
}

syncAdviceDeals();

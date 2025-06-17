// scripts/syncJibPromotions.ts
import 'dotenv/config';
import { scrapeJibPromotions } from '@/backend/scrapers/jibScraper';
import { supabase } from '@/lib/supabase';

export default async function syncJibPromotions() {
  console.log('🚀 เริ่มดึงข้อมูลจาก JIB...');
  const promotions = await scrapeJibPromotions();

  for (const promo of promotions) {
    const { name, price, image, link, description = '' } = promo;

    // ✅ เพิ่ม .select() เพื่อดูผลลัพธ์หลัง upsert
    const { data, error } = await supabase
      .from('deals')
      .upsert(
        {
          name,
          price: price.toString(),
          image,
          link,
          description,
          source: 'jib',
          expires_at: null,
          store_id: null,
        },
        { onConflict: 'name, source' }
      )
      .select(); // ดึงข้อมูลกลับมาด้วย

    if (error) {
      console.error('❌ upsert error:', error);
      continue;
    }

    const deal = data?.[0];
    if (!deal) continue;

    console.log('✅ upsert ดีล:', name);
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const { data: todayHistory, error: historyError } = await supabase
      .from('deal_price_history')
      .select('id')
      .eq('deal_id', deal.id)
      .gte('recorded_at', `${today}T00:00:00`)
      .lt('recorded_at', `${today}T23:59:59`);

    if (!historyError && (todayHistory?.length ?? 0) === 0) {
      await supabase.from('deal_price_history').insert({
        deal_id: deal.id,
        price: price,
      });
      console.log(`📊 บันทึกแนวโน้มราคา: ${name} = ${price}`);
    } else {
      console.log(`ℹ️ ข้ามบันทึกราคา (มีแล้ววันนี้): ${name}`);
    }

    // ✅ เช็คว่าเพิ่งสร้างใหม่จริง (ภายใน 10 วินาที)
    const createdAt = new Date(deal.created_at).getTime();
    const now = Date.now();
    const diffInSeconds = Math.abs(now - createdAt) / 1000;

    if (diffInSeconds < 10) {
      await supabase.from('notifications').insert({
        user_id: null, // Global notification
        deal_id: deal.id,
        type: 'new',
        message: `🎯 พบดีลใหม่จาก JIB: ${name}`,
      });

      console.log('🔔 แจ้งเตือนดีลใหม่แล้ว:', name);
    }
  }

  console.log('🎉 เสร็จสิ้นการซิงค์');
}

syncJibPromotions();

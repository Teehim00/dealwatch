import 'dotenv/config';
import { scrapeJibPromotions } from '@/backend/scrapers/jibScraper';
import { supabase } from '@/lib/supabase';

async function insertJibPromotions() {
  console.log('🚀 เริ่มดึงข้อมูลจาก JIB...');
  const promotions = await scrapeJibPromotions();

  for (const promo of promotions) {
    const { name, price, image, link, description = '' } = promo;
    const priceText = price.toString(); // แปลงเป็น TEXT

    // 👉 ตรวจสอบว่าดีลนี้มีอยู่แล้วหรือไม่
    const { data: existingDeals, error: fetchError } = await supabase
      .from('deals')
      .select('*')
      .eq('name', name)
      .order('created_at', { ascending: false })
      .limit(1);

    if (fetchError) {
      console.error('❌ Error checking existing deal:', fetchError);
      continue;
    }

    const existing = existingDeals?.[0];

    // 👉 เพิ่มดีลใหม่
    const { data: inserted, error: insertError } = await supabase
      .from('deals')
      .insert([
        {
          name,
          price: priceText,
          link,
          image,
          description,
          source: 'jib',
          expires_at: null,
          store_id: null,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error('❌ Insert error:', insertError);
      continue;
    }

    console.log('✅ เพิ่มดีล:', name);

    // ✅ ตรวจสอบการเปลี่ยนแปลงแล้วบันทึก notification
    let notifMessage = '';
    let notifType = '';

    if (!existing) {
      notifType = 'new_deal';
      notifMessage = `🆕 ดีลใหม่: ${name}`;
    } else if (existing.price !== priceText) {
      notifType = 'price_drop';
      notifMessage = `💸 ราคาลด: ${name} จาก ${existing.price} → ${priceText} ฿`;
    }

    if (notifMessage && notifType) {
      const { error: notifError } = await supabase.from('notifications').insert([
        {
          type: notifType,
          message: notifMessage,
          deal_id: inserted.id,
        },
      ]);

      if (notifError) {
        console.error('❌ Insert notification error:', notifError);
      } else {
        console.log('🔔 แจ้งเตือน:', notifMessage);
      }
    }
  }

  console.log('🎉 เสร็จสิ้นการเพิ่มดีลจาก JIB');
}

insertJibPromotions();

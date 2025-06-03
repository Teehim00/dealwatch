// import { scrapeJibPromotions } from '../backend/scrapers/jibScraper';

// (async () => {
//   try {
//     console.log('🚀 เริ่มดึงข้อมูลโปรโมชั่นจาก JIB...');
//     const deals = await scrapeJibPromotions();

//     console.log(`🎯 เจอทั้งหมด: ${deals.length} รายการ`);
//     console.log(deals); // ✅ แสดงผลทั้งหมด

//     // TODO: ถ้าต้องการบันทึกลง Supabase ให้เขียนต่อด้านล่างนี้
//     // const { data, error } = await supabase.from('deals').insert(deals);
//     // if (error) console.error('❌ Supabase insert error:', error);
//     // else console.log('✅ บันทึกลง Supabase สำเร็จ:', data);
//   } catch (error) {
//     console.error('❌ Error during scraping JIB:', error);
//   }
// })();

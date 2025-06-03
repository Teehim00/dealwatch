// scrapers/jibScraper.ts

import puppeteer from 'puppeteer';

export type JibPromotion = {
  name: string;
  price: number;
  image: string;
  link: string;
  description: string;
};

export async function scrapeJibPromotions(): Promise<JibPromotion[]> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log('🌐 เข้าหน้า JIB Promotion...');
    await page.goto('https://www.jib.co.th/web/product/product_promotion', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    await page.waitForSelector('.divboxpro');

    const promotions = await page.$$eval('.divboxpro', boxes => {
      return boxes.map(box => {
        const name = box.querySelector('.promo_name')?.textContent?.trim() || '';

        const priceText =
          box.querySelector('.price_total')?.textContent?.replace(/[^\d]/g, '') || '0';
        const price = parseInt(priceText, 10);

        const imagePath = box.querySelector('img.imgpspecial')?.getAttribute('src') || '';
        const image = imagePath.startsWith('http')
          ? imagePath
          : 'https://www.jib.co.th' + imagePath;

        const rawLink = box.querySelector('.boxname')?.closest('a')?.getAttribute('href') || '';
        const link = rawLink.startsWith('http') ? rawLink : 'https://www.jib.co.th' + rawLink;

        const description =
          box.querySelector('.description')?.textContent?.trim().replace(/\s+/g, ' ') || '';

        return {
          name,
          price,
          image: image.startsWith('http') ? image : 'https://www.jib.co.th' + image,
          link,
          description,
        };
      });
    });

    console.log(`🎯 พบโปรโมชั่นทั้งหมด: ${promotions.length} รายการ`);
    return promotions;
  } catch (error) {
    console.error('❌ Error scraping JIB:', error);
    return [];
  } finally {
    await browser.close();
  }
}

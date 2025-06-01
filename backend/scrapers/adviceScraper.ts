//scrapers/adviceScraper.ts
import puppeteer from 'puppeteer';
import type { Page } from 'puppeteer';

export type AdvicePromotion = {
  name: string;
  link: string;
  image: string;
  description: string;
};

export async function scrapeAdvicePromotions(): Promise<AdvicePromotion[]> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log('🌐 เข้าหน้า Advice Promotion...');
    await page.goto('https://www.advice.co.th/promotion', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    await page.waitForSelector('.list-items');

    const promotions = await page.$$eval('.list-items', items =>
      items.map(el => {
        const name = el.querySelector('.name-news a')?.textContent?.trim() || '';
        const link = el.querySelector('.name-news a')?.getAttribute('href') || '';
        const image = el.querySelector('img')?.getAttribute('src') || '';
        const description = el.querySelector('.desc.detail-news')?.textContent?.trim() || '';

        return {
          name,
          link: link.startsWith('http') ? link : `https://www.advice.co.th${link}`,
          image,
          description,
        };
      })
    );

    return promotions;
  } catch (error) {
    console.error('❌ Error scraping Advice:', error);
    return [];
  } finally {
    await browser.close();
  }
}

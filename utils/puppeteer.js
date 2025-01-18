import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { get_product_by_link, get_links_by_website, add_product, update_product } from './database.js';
import { publish_product } from './queue.js';

export async function initBrowser() {
  puppeteer.use(StealthPlugin);
  return await puppeteer.launch({ headless: false });
}

export async function scrapeDetails(page, db, selectors) {
  const rows = await get_links_by_website(db, selectors.website);
  console.log(`Found ${rows.length} links to scrape details.`);

  for (const { link } of rows) {
    try {
      await page.goto(link, { waitUntil: 'networkidle2' });
      const details = await page.evaluate((link, selectors) => {
        return {
          title: document.querySelector(selectors.title)?.textContent.trim(),
          price: document.querySelector(selectors.price)?.textContent.trim(),
          description: document.querySelector(selectors.description)?.textContent.trim(),
          image: document.querySelector(selectors.image)?.src,
          website: selectors.website,
          link: link,
        };
      }, link, selectors);
      const product = await get_product_by_link(db, link);
      console.log(product);
      if (!product) {
        await add_product(db, details);
        await publish_product(details, 'new_products');
        continue;
      }
      if (product.price != details.price ||
        product.title != details.title ||
        product.description != details.description
      ) {
        await update_product(db, details);
        await publish_product(details, 'updated_products');
      }

    } catch (err) {
      console.error(`Error scraping details for ${link}:`, err);
    }
  }
}

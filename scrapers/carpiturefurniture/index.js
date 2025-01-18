import scrapeProductList from './product_list.js';
import scrapeProductDetails from './product_details.js';

export default async function scrapeCarpiturefurniture(page, db) {
  console.log('Starting Carpiturefurniture scraper...');
  
  // Step 1: Scrape product links
  await scrapeProductList(page, db);

  // Step 2: Scrape product details
  await scrapeProductDetails(page, db);

  console.log('Carpiturefurniture scraping completed.');
}

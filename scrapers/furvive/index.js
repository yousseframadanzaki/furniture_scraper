import scrapeProductList from './product_list.js';
import scrapeProductDetails from './product_details.js';

export default async function scrapeFurvive(page, db) {
  console.log('Starting Furvive scraper...');
  
  // Step 1: Scrape product links
  // await scrapeProductList(page, db);

  // Step 2: Scrape product details
  await scrapeProductDetails(page, db);

  console.log('Furvive scraping completed.');
}

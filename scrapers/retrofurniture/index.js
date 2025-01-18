import scrapeProductList from './product_list.js';
import scrapeProductDetails from './product_details.js';

export default async function scrapeRetrofurniture(page, db) {
  console.log('Starting Retrofurniture scraper...');
  
  // Step 1: Scrape product links
  // await scrapeProductList(page, db);

  // Step 2: Scrape product details
  await scrapeProductDetails(page, db);

  console.log('Retrofurniture scraping completed.');
}

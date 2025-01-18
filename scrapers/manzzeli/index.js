import scrapeProductList from './product_list.js';
import scrapeProductDetails from './product_details.js';

export default async function scrapeManzzeli(page, db) {
  console.log('Starting Manzzeli scraper...');
  
  // Step 1: Scrape product links
  await scrapeProductList(page, db);

  // Step 2: Scrape product details
  await scrapeProductDetails(page, db);

  console.log('Lacasa Manzzeli completed.');
}

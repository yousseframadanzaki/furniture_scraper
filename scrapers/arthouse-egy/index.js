import scrapeProductList from './product_list.js';
import scrapeProductDetails from './product_details.js';

export default async function scrapeArthouseEgy(page, db) {
  console.log('Starting ArthouseEgy scraper...');
  
  await page.setRequestInterception(true);
  page.on('request', interceptedRequest => {
    if (
      interceptedRequest.url().startsWith('https://mywebanalytic.com') ||
      interceptedRequest.url().startsWith('https://googleads.g.doubleclick.net') ||
      interceptedRequest.url().startsWith('https://p.clarity.ms/collect')
    ){
      interceptedRequest.abort();
    }
    else interceptedRequest.continue();
  });
  // Step 1: Scrape product links
  // await scrapeProductList(page, db);

  // Step 2: Scrape product details
  await scrapeProductDetails(page, db);

  console.log('ArthouseEgy scraping completed.');
}

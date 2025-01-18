import { scrapeDetails } from '../../utils/puppeteer.js';

export default async function scrapeProductDetails(page, db) {
    selectors = {
        title: '.product-right h2',
        price: '.product-right h3',
        description: 'div.product-desc',
        image: '.product-thumbnail figure.image img',
        website: 'lacasa'
    }
    await scrapeDetails(page, db, selectors);
}

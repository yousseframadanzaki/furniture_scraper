import { scrapeDetails } from '../../utils/puppeteer.js';

export default async function scrapeProductDetails(page, db) {
    selectors = {
        title: 'h1.product-title',
        price: 'div.price__current span.money',
        description: 'div.tab-panel',
        image: 'img.product-gallery--loaded-image',
        website: 'manzzeli'
    }
    await scrapeDetails(page, db, selectors);
}

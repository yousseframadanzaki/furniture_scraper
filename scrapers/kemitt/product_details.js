import { scrapeDetails } from '../../utils/puppeteer.js';

export default async function scrapeProductDetails(page, db) {
    selectors = {
        title: 'h1.productSingle-title',
        price: 'h3.productSingle_original_price',
        description: 'div.productSingle-body',
        image: 'div.swiper-zoom-container img',
        website: 'kemitt'
    }
    await scrapeDetails(page, db, selectors);
}

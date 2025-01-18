import { scrapeDetails } from '../../utils/puppeteer.js';

export default async function scrapeProductDetails(page, db) {
    let selectors = {
        title: 'h1.product_title',
        price: 'div.summary p.price ins span.woocommerce-Price-amount bdi',
        description: 'div#tab-description',
        image: 'div.woocommerce-product-gallery__image a img.wp-post-image',
        website: 'retrofurniture'
    }
    await scrapeDetails(page, db, selectors);
}

import { scrapeDetails } from '../../utils/puppeteer.js';

export default async function scrapeProductDetails(page, db) {
    selectors = {
        title: 'h1.product_title',
        price: 'div.summary p.price span.electro-price ins span.woocommerce-Price-amount bdi',
        description: 'div.woocommerce-product-details__short-description',
        image: 'div.woocommerce-product-gallery__image a img.wp-post-image',
        website: 'ro2yahome'
    }
    await scrapeDetails(page, db, selectors);
}

import {scrapeDetails} from '../../utils/puppeteer.js';

export default async function scrapeProductDetails(page, db) {
    selectors = {
        title:'h1.product_title',
        price:'span.woocommerce-Price-amount',
        description:'table.woocommerce-product-attributes',
        image:'figure.woocommerce-product-gallery__wrapper .flex-active-slide a picture img',
        website:'furvive'
    }
    await scrapeDetails(page,db,selectors);
}

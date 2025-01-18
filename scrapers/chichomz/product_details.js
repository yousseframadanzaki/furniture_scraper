import {scrapeDetails} from '../../utils/puppeteer.js';

export default async function scrapeProductDetails(page, db) {
    selectors = {
        title:'div.product__title h1',
        price:'span.price-item',
        description:'div.product__description',
        image:'div.product__media img',
        website:'chichomz'
    };
    await scrapeDetails(page,db,selectors);
}

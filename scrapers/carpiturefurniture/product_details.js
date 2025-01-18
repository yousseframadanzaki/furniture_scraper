import {scrapeDetails} from '../../utils/puppeteer.js';

export default async function scrapeProductDetails(page, db) {
    selectors = {
        title:'h1.product-name a',
        price:'span#js-product-price',
        description:'div.description',
        image:'img.main-image',
        website:'carpiturefurniture'
    };
    await scrapeDetails(page,db,selectors);
}

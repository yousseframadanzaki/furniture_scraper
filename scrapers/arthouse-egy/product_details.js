import {scrapeDetails} from '../../utils/puppeteer.js';

export default async function scrapeProductDetails(page, db) {
    selectors = {
        title:'h1.page-title span',
        price:'span.price-wrapper span.price',
        description:'div#description div.product div.value',
        image:'div.fotorama__stage__frame img.fotorama__img',
        website:'arthouse-egy'
    };
    await scrapeDetails(page,db,selectors);
}

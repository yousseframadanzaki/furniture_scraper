import {scrapeDetails} from '../../utils/puppeteer.js';

export default async function scrapeProductDetails(page, db) {
    selectors = {
        title:'h1.ProductDetails_prodct_name__0c3jc',
        price:'p.base-product-price_bold__DqOea',
        description:'div.ProductDescription_Description_container__sYOoE',
        image:'div.swiper-slide-active img',
        website:'homzmart'
    }
    await scrapeDetails(page,db,selectors);
}

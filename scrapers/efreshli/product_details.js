import {scrapeDetails} from '../../utils/puppeteer.js';

export default async function scrapeProductDetails(page, db) {
    selectors = {
        title:'h1.ProductDashboard-styled__ProductTitle-sc-a5c0d94e-9',
        price:'h2.ProductDashboard-styled__Price-sc-a5c0d94e-14',
        description:'p.CollapseInfo-styled__DescriptionWrapper-sc-f32bbffe-6',
        image:'img.ProductDashboard-styled__MainImage-sc-a5c0d94e-2',
        website:'efreshli'
    }
    await scrapeDetails(page,db,selectors);
}

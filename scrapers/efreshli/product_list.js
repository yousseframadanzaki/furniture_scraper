import { add_link } from '../../utils/database.js'



async function scrapePage(page, db) {
    const product_links = await page.evaluate(() => {
        const links = document.querySelectorAll('a.ProductCard-styled__ProductImgWrapper-sc-4e142eab-9');
        return Array.from(links).map(link => link.href);
    });

    if (product_links.length > 0) {
        for (const link of product_links) {
            await add_link(db, link, "efreshli")
        }
    }
}

async function clickNextButton(page) {
    const nextButton = await page.$('[aria-label="Next page"]');
    if (nextButton) {
        const isDisabled = await page.evaluate(
            (button) => button.getAttribute('aria-disabled') === 'true',
            nextButton
        );

        if (!isDisabled) {
            await nextButton.click();
            return true;
        } else {
            return false;
        }
    }
    return false;
}

export default async function scrapeProductList(page, db) {
    const urls = [
        'https://efreshli.com/shop/categories?search_query=%25&page=1&sort_key=recommended&sort_type=desc',
    ];
    let counter = 0;
    for (const url of urls) {
        console.log(`Navigating to: ${url}`);
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        page.on('error', err => {
            console.error('Page crashed:', err);
          });
          
          page.on('close', () => {
            console.log('Page closed unexpectedly.');
          });
        let hasNextPage = true;
        while (hasNextPage) {
            await scrapePage(page, db);
            counter++
            hasNextPage = await clickNextButton(page);

            if (hasNextPage) {
                await new Promise(resolve => setTimeout(resolve, 1500));
                await page.waitForSelector('a.ProductCard-styled__ProductImgWrapper-sc-4e142eab-9', { timeout: 10000 });
            }
        }
    }
    console.log(`Scraped ${counter} page`);
}
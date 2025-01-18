import { initBrowser } from './utils/puppeteer.js';
import { initDatabase } from './utils/database.js';
import scrapers from './scrapers/index.js';

(async () => {
    const browser = await initBrowser();
    const db = await initDatabase();

    for (const scraper of scrapers) {
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
        });

        console.log(`Running scraper: ${scraper.name}`);
        try {
            await scraper(page, db);
        } catch (err) {
            console.error(`Error running scraper: ${scraper.name}`, err);
        } finally {
            await page.close();
        }
    }

    await db.close();
    await browser.close();
    console.log('All scrapers completed.');
})();

import { add_link } from '../../utils/database.js'



async function scrapePage(page, db) {
  const product_links = await page.evaluate(() => {
    const links = document.querySelectorAll('h3.card__heading a.full-unstyled-link');
    return Array.from(links).map(link => link.href);
  });

  if (product_links.length > 0) {
    for (const link of product_links) {
      await add_link(db, link, "chichomz")
    }
  }
}

async function clickNextButton(page) {
  try {
    await page.waitForSelector('[aria-label="Next page"]', { timeout: 10000 });
    const nextButton = await page.$('[aria-label="Next page"]');
    if (nextButton) {
      const isDisabled = await page.evaluate(
        (button) => button.classList.contains('disabled'),
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
  } catch (e) {
    return false;
  }
}

export default async function scrapeProductList(page, db) {
  const urls = [
    'https://chichomz.com/en/search?q=%25&options%5Bprefix%5D=last'
  ];
  let counter = 0;
  for (const url of urls) {
    console.log(`Navigating to: ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    let hasNextPage = true;
    while (hasNextPage) {
      await scrapePage(page, db);
      counter++;
      hasNextPage = await clickNextButton(page);

      if (hasNextPage) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await page.waitForSelector('h3.card__heading a.full-unstyled-link', { timeout: 10000 });
      }
    }
  }
  console.log(`Scraped ${counter} page`);
}
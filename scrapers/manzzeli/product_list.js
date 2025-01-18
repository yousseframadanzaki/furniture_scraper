import { add_link } from '../../utils/database.js'



async function scrapePage(page, db) {
  const product_links = await page.evaluate(() => {
    const links = document.querySelectorAll('a.productitem--image-link');
    return Array.from(links).map(link => link.href);
  });

  if (product_links.length > 0) {
    for (const link of product_links) {
      await add_link(db, link, "manzzeli")
    }
  }
}

async function clickNextButton(page) {
  try {
    await page.waitForSelector('[aria-label="Go to next page"]', { timeout: 10000 });
    const nextButton = await page.$('[aria-label="Go to next page"]');
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
    'https://manzzeli.com/search?page=1&q=%25%2A&type=product'
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
        await page.waitForSelector('a.productitem--image-link', { timeout: 10000 });
      }
    }
  }
  console.log(`Scraped ${counter} page`);
}
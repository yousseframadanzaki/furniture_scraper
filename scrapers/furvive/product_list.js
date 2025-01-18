import { add_link } from '../../utils/database.js'



async function scrapePage(page, db) {
  const product_links = await page.evaluate(() => {
    const links = document.querySelectorAll('a.woocommerce-LoopProduct-link');
    return Array.from(links).map(link => link.href);
  });

  if (product_links.length > 0) {
    for (const link of product_links) {
      await add_link(db, link, "furvive")
    }
  }
}

async function clickNextButton(page) {
  try {
    await page.waitForSelector('[data-value="next"]',{ timeout: 10000 });
    const nextButton = await page.$('[data-value="next"]');
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
  } catch (err) {
    return false;
  }
}

export default async function scrapeProductList(page, db) {
  const urls = [
    'https://furvive.com/product-category/office_furniture/',
    'https://furvive.com/product-category/home_furniture/',
    'https://furvive.com/product-category/accessories/',
    'https://furvive.com/product-category/lighting-3/',
    'https://furvive.com/product-category/kitchen/'
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
        await page.waitForSelector('a.woocommerce-LoopProduct-link', { timeout: 10000 });
      }
    }
  }
  console.log(`Scraped ${counter} page`);
}
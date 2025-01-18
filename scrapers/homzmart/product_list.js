import { add_link } from '../../utils/database.js'



async function scrapePage(page, db) {
  const product_links = await page.evaluate(() => {
    const links = document.querySelectorAll('div.base-productCard_productCard_container__JWX6i a');
    return Array.from(links).map(link => link.href);
  });

  if (product_links.length > 0) {
    for (const link of product_links) {
      await add_link(db, link, "homzmart")
    }
  }
}

async function clickNextButton(page) {
  const nextButton = await page.$('[aria-label="Go to next page"]');
  if (nextButton) {
    const isDisabled = await page.evaluate(
      (button) => button.classList.contains('Mui-disabled'),
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
    'https://homzmart.com/en/c/furniture',
    'https://homzmart.com/en/c/storage',
    'https://homzmart.com/en/c/home-decor',
    'https://homzmart.com/en/c/office-furniture',
    'https://homzmart.com/en/c/lighting',
    'https://homzmart.com/en/c/fabric-bedding',
    'https://homzmart.com/en/c/kitchen-bathroom/full-kitchen',
    'https://homzmart.com/en/c/kitchen-bathroom/bathroom?q=%7B%22currentPage%22%3A1%2C%22pageSize%22%3A24%2C%22filter%22%3A%7B%22url_key%22%3A%5B%22kitchen-bathroom%2Fbathroom%22%5D%2C%22category_id%22%3A%5B%2233%22%2C%22787%22%2C%2280%22%5D%7D%2C%22sort%22%3A%22default%22%2C%22lang%22%3A%22en%22%7D',
    'https://homzmart.com/en/c/outdoors'
  ];
  let counter = 0;
  for (const url of urls) {
    console.log(`Navigating to: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2' });

    let hasNextPage = true;
    while (hasNextPage) {
      await scrapePage(page, db);
      counter++;
      hasNextPage = await clickNextButton(page);

      if (hasNextPage) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        await page.waitForSelector('div.base-productCard_productCard_container__JWX6i a', { timeout: 10000 });
      }
    }
  }
  console.log(`Scraped ${counter} page`);
}
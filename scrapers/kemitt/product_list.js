import { add_link } from '../../utils/database.js'



async function scrapePage(page, db) {
  const product_links = await page.evaluate(() => {
    const links = document.querySelectorAll('.product_card_body_title a');
    return Array.from(links).map(link => link.href);
  });

  if (product_links.length > 0) {
    for (const link of product_links) {
      await add_link(db, link, "kemitt")
    }
  }
}

async function clickNextButton(page) {
  try {
    await page.waitForSelector('li.right-arrow a', { timeout: 10000 });
    const nextButton = await page.$('li.right-arrow a');
    const list_item = await page.$('li.right-arrow');
    if (nextButton) {
      const isDisabled = await page.evaluate(
        (button) => button.classList.contains('disabled'),
        list_item
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
    'https://kemitt.com/en-eg/categories/Bedding',
    'https://kemitt.com/en-eg/categories/bedroom',
    'https://kemitt.com/en-eg/categories/Consol',
    'https://kemitt.com/en-eg/categories/Sofas',
    'https://kemitt.com/en-eg/categories/Lighting',
    'https://kemitt.com/en-eg/categories/Chairs',
    'https://kemitt.com/en-eg/categories/Tools-and-Home-Supplies',
    'https://kemitt.com/en-eg/categories/pouffe',
    'https://kemitt.com/en-eg/categories/Kitchen-and-tabletop',
    'https://kemitt.com/en-eg/categories/Bookshelves',
    'https://kemitt.com/en-eg/categories/tables',
    'https://kemitt.com/en-eg/categories/Dining?page=1',
    'https://kemitt.com/en-eg/categories/Wardrobes?page=1',
    'https://kemitt.com/en-eg/categories/Office-Furniture?page=1',
    'https://kemitt.com/en-eg/categories/Kitchen?page=1',
    'https://kemitt.com/en-eg/categories/Mirrors?page=1',
    'https://kemitt.com/en-eg/categories/Carpets?page=1',
    'https://kemitt.com/en-eg/categories/Curtains-and-textiles?page=1',
    'https://kemitt.com/en-eg/categories/Decoration',
    'https://kemitt.com/en-eg/categories/Cookware',
    'https://kemitt.com/en-eg/categories/Outdoor'
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
        await page.waitForSelector('.product_card_body_title a', { timeout: 10000 });
      }
    }
  }
  console.log(`Scraped ${counter} page`);
}
import { timeout } from 'puppeteer';
import { add_link } from '../../utils/database.js'



async function scrapePage(page, db) {
  const product_links = await page.evaluate(() => {
    const links = document.querySelectorAll('a.product-item-photo');
    return Array.from(links).map(link => link.href);
  });

  if (product_links.length <= 0) {
    return;
  }
  for (const link of product_links) {
    await add_link(db, link, "arthouse-egy")
  }
}

async function clickNextButton(page) {
  try {
    await page.waitForSelector('a.next', { timeout: 5000});
    
    const nextButton = await page.$('a.next');
    if (nextButton) {
      const isDisabled = await page.evaluate(
        (button) => button.classList.contains('disabled'),
        nextButton
      );

      if (!isDisabled) {
        // Ensure the button is in the viewport and scroll to it
        await nextButton.scrollIntoViewIfNeeded();
        await page.evaluate((button) => {
          button.click();
        }, nextButton);
        
        // Optional: wait for navigation or DOM changes
        await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 10000 }).catch(() => {
          console.log("No navigation occurred after clicking next.");
        });
        
        return true;
      } else {
        console.log("Next button is disabled.");
        return false;
      }
    }

    console.log("Next button not found.");
    return false;
  } catch (e) {
    console.error("Error in clickNextButton:", e.message);
    return false;
  }
}


export default async function scrapeProductList(page, db) {
  const urls = [
    'https://arthouse-egy.com/en/online?p=1&product_list_limit=36'
  ];
  let counter = 0;

  for (const url of urls) {
    console.log(`Navigating to: ${url}`);
    await page.goto(url,{ waituntil:'domcontentloaded' });

    let hasNextPage = true;
    while (hasNextPage) {
      await scrapePage(page, db);
      counter++;
      hasNextPage = await clickNextButton(page);

      if (hasNextPage) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await page.waitForSelector('a.product-item-photo', { timeout: 10000 });
      }
    }
  }
  console.log(`Scraped ${counter} page`);
}
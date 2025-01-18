import { add_link } from '../../utils/database.js'



async function scrapePage(page, db) {
  const product_links = await page.evaluate(() => {
    const links = document.querySelectorAll('.img-wrapper .front a');
    return Array.from(links).map(link => link.href);
  });

  if (product_links.length > 0) {
    for (const link of product_links) {
      await add_link(db, link, "lacasa")
    }
  }
}

async function clickNextButton(page) {
  const nextButton = await page.$('[aria-label="Next"]');
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
}

export default async function scrapeProductList(page, db) {
  const urls = [
    'https://lacasa-egy.com/shop?category=beds*sofas*chairs*tables*tv-units-tv-sets*room-sets*kids-furniture*&page=1&sale=0',
    'https://lacasa-egy.com/shop?category=dressers-wardrobe*drawers-media-storage*bookcases-shelving-units*coffee-corners*shoe-storage*makeup-vanity*nightstands*jewelry-organizers*kitchen-units*bathroom-storage*clothes-hangers*bathroom-accessories*buffets*&page=1&sale=0',
    'https://lacasa-egy.com/shop?category=floor-lamps*table-lamps*ceiling-lamps*wall-lamps*desk-lamps*lighting-bundles*crystal-lighting*boho-lighting*outdoor-lighting*bulbs*lampshades*spots*&page=1&sale=0',
    'https://lacasa-egy.com/shop?category=bean-bags*rattan-lounge-sets*table-sets*bars-stools*swings*outdoor-sofas*outdoor-chaise-lounges*outdoor-chairs*outdoor-storage-units*beach-mats*steel-lounge-sets*&page=1&sale=0',
    'https://lacasa-egy.com/shop?category=mirrors*clocks*decorative-accents*artworks*rugs*cushions*pots-planters*curtains*bedding*pillows*table-cloths*mattresses*table-runners*tapestries*canvas*boho-style*christmas-decorations*sculptures*&page=1&sale=0',
    'https://lacasa-egy.com/shop?category=desks*office-chairs*&page=1&sale=0',
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
        await page.waitForSelector('.img-wrapper .front a', { timeout: 10000 });
      }
    }
  }
  console.log(`Scraped ${counter} page`);
}
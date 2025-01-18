import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function initDatabase() {
  const db = await open({
    filename: 'products.db',
    driver: sqlite3.Database,
  });

  await db.exec(`
      CREATE TABLE IF NOT EXISTS product_links (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        link TEXT UNIQUE,
        website TEXT
      );
    `);

  await db.exec(`
      CREATE TABLE IF NOT EXISTS product_details (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        link TEXT UNIQUE,
        title TEXT,
        price TEXT,
        description TEXT,
        image TEXT,
        website TEXT
      );
    `);

  return db;
}

export async function add_link(db, link, website) {
  const insert = await db.prepare('INSERT OR IGNORE INTO product_links (link,website) VALUES (?,?)');
  try {
    await insert.run(link, website);
  } catch (err) {
    console.error(`Error saving link: ${link}`, err);
  }
  await insert.finalize();
}

export async function add_product(db, details) {
  const insert = await db.prepare('INSERT OR IGNORE INTO product_details (title,price,description,image,link,website) VALUES (?,?,?,?,?,?)');
  try {
    await insert.run(details.title, details.price, details.description, details.image, details.link, details.website);
  } catch (err) {
    console.error(`Error saving link: ${link}`, err);
  }
  await insert.finalize();
}

export async function update_product(db, details) {
  const update = await db.prepare('UPDATE product_details SET title = ?,price = ?,description = ?,image = ?,website = ? WHERE link = ?');
  try {
    await update.run(details.title, details.price, details.description, details.image, details.website, details.link);
  } catch (err) {
    console.error(`Error updating link: ${link}`, err);
  }
  await update.finalize();
}

export async function get_links_by_website(db, website) {
  return await db.all('SELECT link FROM product_links WHERE website = ?', website);
}

export async function get_product_by_link(db, link) {
  return await db.get('SELECT * FROM product_details WHERE link = ? LIMIT 1', link);
}
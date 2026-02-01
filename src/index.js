require("dotenv").config();
const { chromium } = require("playwright");
const { createDb } = require("./config/db");
const { transformBookData } = require("./transformers/bookValidator");
const { scrapeBooks } = require("./extractors/booksScraper");
const { exportToCsv } = require("./loaders/csvExporter");
const { runImageDownloader } = require("./services/imageService");

async function run() {
  const db = await createDb();

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  // Step 1: Extract data from the website
  const rawData = await scrapeBooks(page, 2);
  console.log(`📦 Got ${rawData.length} raw items from web.`);

  for (const item of rawData) {
    // Di dalam loop for (const item of rawData)
    const cleanData = transformBookData(item);

    if (cleanData) {
      const queryText = `
    INSERT INTO products (name, price_text, price_value, source, image_url)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (name) DO NOTHING
  `;

      const values = [
        cleanData.title, // $1
        cleanData.price_text, // $2
        cleanData.price_value, // $3
        "books.toscrape", // $4
        cleanData.image_url, // $5
      ];

      await db.query(queryText, values);
    }
  }
  // Step 2: Download product images based on stored URLs
  await runImageDownloader(db);
  // Step 3: Export the database records to a CSV file
  await exportToCsv(db);

  await browser.close();
  await db.end();

  console.log("Pipeline finished");
}

run().catch(console.error);

require("dotenv").config();
const { chromium } = require("playwright");
const { createDb } = require("./config/db");
const { scrapeBooks } = require("./scraper/booksScraper");
const { exportToCsv } = require("./exporter/csvExporter");
const { runImageDownloader } = require("./services/imageService");

async function run() {
  const db = await createDb();

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  // Step 1: Extract data from the website
  await scrapeBooks(page, db, 2);
  // Step 2: Download product images based on stored URLs
  await runImageDownloader(db);
  // Step 3: Export the database records to a CSV file
  await exportToCsv(db);

  await browser.close();
  await db.end();

  console.log("Pipeline finished");
}

run().catch(console.error);

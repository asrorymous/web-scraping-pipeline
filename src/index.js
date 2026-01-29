require("dotenv").config();

const { chromium } = require("playwright");
const { createDb } = require("./config/db");
const { scrapeBooks } = require("./scraper/booksScraper");
const { exportToCsv } = require("./exporter/csvExporter");

async function run() {
  const db = await createDb();

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await scrapeBooks(page, db, 2);
  await exportToCsv(db);

  await browser.close();
  await db.end();

  console.log("Pipeline finished");
}

run().catch(console.error);

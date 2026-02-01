require("dotenv").config();
const { chromium } = require("playwright");
const { createDb } = require("./config/db");
const { transformBookData } = require("./transformers/bookValidator");
const { extractBooks } = require("./extractors/bookExtractor");
const { exportToCsv } = require("./loaders/csvExporter");
const { runImageDownloader } = require("./services/imageService");

async function run() {
  let db;
  let browser;

  // Track processing metrics for the final report
  let stats = { extracted: 0, valid: 0, rejected: 0 };

  try {
    db = await createDb();
    browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    // Extraction: Pulling raw data from the source website
    const rawData = await extractBooks(page, 2);
    stats.extracted = rawData.length;
    // Pastikan jadi begini:
    console.log(`📦 Extraction complete. Found ${stats.extracted} items.`);

    // Transformation & Loading: Validating and persisting data
    for (const item of rawData) {
      const cleanData = transformBookData(item);

      if (cleanData) {
        stats.valid++;
        const queryText = `
          INSERT INTO products (name, price_text, price_value, source, image_url)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (name) DO NOTHING
        `;

        const values = [
          cleanData.title,
          cleanData.price_text,
          cleanData.price_value,
          "books.toscrape",
          cleanData.image_url,
        ];

        await db.query(queryText, values);
      } else {
        stats.rejected++;
      }
    }

    // Post-processing: Image synchronization and data export
    await runImageDownloader(db);
    await exportToCsv(db);

    // Displays the final ETL process summary
    console.log("\n--- ETL JOB SUMMARY ---");
    console.table(stats);
  } catch (error) {
    console.error("❌ Pipeline execution failed:", error.message);
  } finally {
    // Ensures all resources are released properly
    if (browser) await browser.close();
    if (db) {
      await db.end();
      console.log("🔌 Database connection closed.");
    }
    console.log("🏁 Process finished.");
  }
}

run().catch((err) => console.error("FATAL SYSTEM ERROR:", err));

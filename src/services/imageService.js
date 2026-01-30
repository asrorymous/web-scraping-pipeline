/* * Image Service
 * Handles the logic of fetching image URLs from the database
 * and delegating the download task to the utility module.
 */

const path = require("path");
const fs = require("fs");
const { downloadFile } = require("../utils/downloader");

async function runImageDownloader(dbClient) {
  console.log("--- Starting Image Downloading Process --- ");

  // Fetch product data that has an associated image url

  const res = await dbClient.query(
    "SELECT name, image_url FROM products WHERE image_url IS NOT NULL",
  );

  console.log(`Found ${res.rows.length} images to process.`);

  // iterate throught each record and trigger the download

  for (let i = 0; i < res.rows.length; i++) {
    const row = res.rows[i];

    // Create a URL-friendly filename (slug)
    const fileName = `${row.name.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.jpg`;

    // Construct the full path to the image file
    const filePath = path.join(__dirname, "../../output/images", fileName);

    // --- SMART SYNC LOGIC ---
    // Check if the file already exists in our folder
    if (fs.existsSync(filePath)) {
      console.log(
        `[${i + 1}/${res.rows.length}] Skipping: ${fileName} (Already exists)`,
      );
      continue; // Langsung lanjut ke baris berikutnya, nggak usah download
    }

    const cleanUrl =
      "https://books.toscrape.com/" + row.image_url.replace(/(\.\.\/)+/g, "");

    console.log(`[${i + 1}/${res.rows.length}] Downloading: ${fileName}`);

    // let do it
    await downloadFile(cleanUrl, fileName);
  }

  console.log("--- Image Download Process Completed ---");
}

module.exports = { runImageDownloader };

/* * Image Service
 * Handles the logic of fetching image URLs from the database
 * and delegating the download task to the utility module.
 */

const { downloadFile } = require("../utils/downloader");

async function runImageDownloader(dbClient) {
  console.log("--- Starting Image Downloading Process --- ");

  // Fetch product data that has an associated image url
  const res = await dbClient.query(
    "SELECT name, image_url FROM products Where image_url IS NOT NULL",
  );

  console.log(`Found ${res.rows.length} images to process.`);

  // iterate throught each record and trigger the download
  for (let i = 0; i < res.rows.length; i++) {
    const row = res.rows[i];

    /* * Sanitize and format the URL.
     * The website uses relative paths like "../../", so we remove them
     * to form a valid absolute URL.
     */
    const cleanUrl =
      "https://books.toscrape.com/" + row.image_url.replace(/(\.\.\/)+/g, "");

    // creat a URL-friendly filename (slug) based on the product name
    const fileName = `${row.name.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.jpg`;

    console.log(`[${i + 1}/${res.rows.length}] Downloading: ${fileName}`);

    await downloadFile(cleanUrl, fileName);
  }
  console.log("--- Image Download Process Completed ---");
}

module.exports = { runImageDownloader };

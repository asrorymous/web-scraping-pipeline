const { randomDelay } = require("../utils/delay");

async function scrapeBooks(page, dbClient, maxPage = 2) {
  for (let pageNum = 1; pageNum <= maxPage; pageNum++) {
    const url = `https://books.toscrape.com/catalogue/page-${pageNum}.html`;
    console.log(`Scraping page ${pageNum}: ${url}`);

    await page.goto(url);

    const books = await page.evaluate(() => {
      const data = [];
      document.querySelectorAll(".product_pod").forEach((item) => {
        data.push({
          title: item.querySelector("h3 a").getAttribute("title"),
          priceText: item.querySelector(".price_color").innerText,
        });
      });
      return data;
    });

    for (const book of books) {
      const priceValue = parseFloat(book.priceText.replace(/[^0-9.]/g, ""));

      await dbClient.query(
        `INSERT INTO products
   (name, price_text, price_value, source)
   VALUES ($1,$2,$3,$4)
   ON CONFLICT (name) DO NOTHING`,
        [book.title, book.priceText, priceValue, "books.toscrape"],
      );
    }

    await randomDelay(1000, 3000);
  }
}

module.exports = { scrapeBooks };

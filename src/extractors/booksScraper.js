const { randomDelay } = require("../utils/delay");

async function scrapeBooks(page, maxPage = 2) {
  const allResults = []; // Ember besar buat nampung semua hasil

  for (let pageNum = 1; pageNum <= maxPage; pageNum++) {
    const url = `https://books.toscrape.com/catalogue/page-${pageNum}.html`;
    console.log(`Scraping page ${pageNum}: ${url}`);

    await page.goto(url);

    const books = await page.evaluate(() => {
      const data = [];
      document.querySelectorAll(".product_pod").forEach((item) => {
        data.push({
          title: item.querySelector("h3 a").getAttribute("title"),
          price: item.querySelector(".price_color").innerText,
          image_url: item.querySelector(".thumbnail").getAttribute("src"),
        });
      });
      return data;
    });

    // to the big bag
    allResults.push(...books);

    await randomDelay(1000, 3000);
  }
  return allResults;
}

module.exports = { scrapeBooks };

const fs = require("fs");

async function exportToCsv(dbClient, outputPath = "output/results.csv") {
  const res = await dbClient.query(
    "SELECT name, price_text, price_value, source FROM products",
  );

  const header = "Name;Price Text;Price Value;Source\n";

  const rows = res.rows
    .map((r) => `"${r.name}";"${r.price_text}";${r.price_value};"${r.source}"`)
    .join("\n");

  fs.writeFileSync(outputPath, header + rows);
  console.log("CSV exported");
}

module.exports = { exportToCsv };

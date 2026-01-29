# Web Scraping Pipeline — Playwright + Node.js + PostgreSQL

A modular web scraping pipeline built with Node.js and Playwright.  
This project is created as a structured learning exercise to practice real-world scraping workflow, data normalization, database storage, and CSV export.

---

## 🚀 Features

- Scrape product data from a paginated website
- Extract structured fields (title and price)
- Normalize numeric price values
- Store results into PostgreSQL
- Prevent duplicate inserts using UNIQUE constraint + ON CONFLICT
- Export stored data to CSV
- Modular folder architecture
- Environment-based configuration using dotenv

---

## ⚙️ Tech Stack

- Node.js
- Playwright
- PostgreSQL
- pg (node-postgres)
- dotenv

---

## 📁 Project Structure

```
src/
  config/
    db.js
  scraper/
    booksScraper.js
  exporter/
    csvExporter.js
  utils/
    delay.js
  index.js

output/
.env
.gitignore
package.json
README.md
```

---

## 🗄️ Database Schema

```sql
CREATE DATABASE scraping_pipeline;

\c scraping_pipeline

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE,
  price_text TEXT,
  price_value NUMERIC,
  source TEXT,
  scraped_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔐 Environment Variables

Create a `.env` file in the project root:

```
DB_USER=postgres
DB_PASS=your_password
DB_NAME=scraping_pipeline
DB_PORT=5432
```

---

## 📦 Installation

```bash
npm install
npx playwright install
```

---

## ▶️ Run Pipeline

```bash
node src/index.js
```

Pipeline flow:

1. Launch browser with Playwright
2. Scrape paginated product pages
3. Normalize price values
4. Insert into PostgreSQL
5. Skip duplicates automatically
6. Export to CSV (`output/results.csv`)

---

## 🧠 Data Integrity Strategy

Duplicates are prevented using:

- Database UNIQUE constraint on `products.name`
- SQL safeguard:

```sql
ON CONFLICT (name) DO NOTHING
```

This allows the pipeline to be safely re-run without duplicating rows.

---

## 📄 Output

CSV file will be generated at:

```
output/results.csv
```

Format:

```
Name | Price Text | Price Value | Source
```

---

## 📌 Notes

This project focuses on:

- modular scraping structure
- clean data pipeline flow
- safe database writes
- repeatable execution
- readable code organization

Future improvements can include logging, retry strategies, configuration files, and automated tests.

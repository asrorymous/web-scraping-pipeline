# 🚀 Automated Web Scraping & Asset Pipeline

A modular data extraction system built with **Node.js**, **Playwright**, and **PostgreSQL**. This project focuses on a complete pipeline flow: from paginated scraping to structured database storage and intelligent image management.

## 🌟 Core Functionalities

- **Paginated Scraping:** Automated data extraction across multiple pages using Playwright.
- **Database Persistence:** Reliable data storage in PostgreSQL with duplicate handling.
- **Smart Asset Sync:** - Downloads product images directly from stored database URLs. - **Efficiency-first:** Checks for existing files before downloading to optimize local storage and bandwidth.
  ...

## 🌟 Key Features

- **Automated Scraping:** Handles paginated product extraction using Playwright.
- **Data Normalization:** Converts raw web strings into clean numeric values for financial accuracy.
- **Relational Storage:** Stores results in PostgreSQL with a focus on data integrity.
- **Smart Asset Sync:** - Downloads product images based on database records.
  - **Idempotent Processing:** Automatically skips existing files to optimize bandwidth and speed.
  - Filename sanitization for cross-platform compatibility.
- **Duplicate Prevention:** Uses `UNIQUE` constraints and `ON CONFLICT` logic for repeatable execution.
- **CSV Export:** Generates structured reports for downstream analysis.

## ⚙️ Tech Stack

- **Runtime:** Node.js
- **Automation:** Playwright (Chromium)
- **Database:** PostgreSQL
- **Environment:** Dotenvx / Dotenv

## 📁 Project Structure

```text
src/
  ├── config/     # Database connection & env config
  ├── scraper/    # Playwright extraction logic
  ├── services/   # Image processing & Smart Sync logic
  ├── exporter/   # CSV generation service
  ├── utils/      # Shared helpers (downloader, delay)
  └── index.js    # Pipeline entry point
output/
  └── images/     # Local image repository
```

---

## 🗄️ Database Schema

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE,
  price_text TEXT,
  price_value NUMERIC,
  source TEXT,
  image_url TEXT,
  scraped_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔐 Environment Variables

Create a `.env` file in the project root:

```ini
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

## 🧠 Data Pipeline Flow

1. `Extract`: Playwright navigates pages and scrapes product metadata (Title, Price, Image URL).
2. `Persist`: Data is normalized and pushed to PostgreSQL, automatically skipping duplicates.
3. `Sync`: Image service queries the DB and downloads missing assets to output/images/.
4. `Export`: The final processed database state is exported to a clean CSV file.

---

## 🛠️ Tech Stack

```
Runtime: Node.js
Automation: Playwright
Database: PostgreSQL
Environment: Dotenvx
```

## 🚀 Quick Start

1. **Install:** `npm install && npx playwright install chromium`
2. **Setup:** Create a `.env` file and ensure `output/images` folder exists.
3. **Run:** `node src/index.js`

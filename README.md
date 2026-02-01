# 🏗️ Automated Data Ingestion & ETL Pipeline

[![Node.js](https://img.shields.io/badge/Runtime-Node.js-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue.svg)](https://www.postgresql.org/)
[![Zod](https://img.shields.io/badge/Validation-Zod-purple.svg)](https://zod.dev/)

A professional-grade **ETL (Extract, Transform, Load)** pipeline designed for robust data collection and structural integrity. This system focuses on bridging the gap between unstructured external sources and highly-structured analytical storage.

## 🌟 The "ETL" Engineering Approach

Unlike standard scrapers, this system is built as a **Data Pipeline**, emphasizing data quality and idempotent processing:

- **Modular Extraction (E):** Uses an abstraction layer (Playwright) to ingest data from dynamic sources, mimicking human interaction for high-quality DOM-based extraction.
- **Strict Transformation (T):** Implements **Schema-as-Code** with **Zod**. Every incoming data point is validated, sanitized, and normalized before it touches the persistence layer.
- **Intelligent Loading (L):** Leverages PostgreSQL's `ON CONFLICT` (Upsert) logic for incremental ingestion, ensuring no duplicate records and high database efficiency.
- **Automated Asset Synchronization:** A dedicated service for localizing external assets (images) with built-in deduplication to optimize storage bandwidth.

---

## 🛠️ Tech Stack

- **Engine:** Node.js (Asynchronous Runtime)
- **Ingestion:** Playwright (Headless Browser Automation)
- **Validation:** Zod (Type-safe Schema Validation)
- **Persistence:** PostgreSQL (Relational Database)
- **Environment:** Dotenvx (Secure Configuration Management)

---

## 📂 System Architecture

The project follows a modular architecture to ensure scalability and ease of maintenance:

```text
src/
├── extractors/   # [E] Source-specific ingestion logic (e.g., Book catalogs)
├── transformers/ # [T] Data cleansing, normalization, and Zod schema validation
├── loaders/      # [L] Database persistence & File-system asset synchronization
├── config/       # Connection pools and environment settings
└── index.js      # The Pipeline Orchestrator
```

## 🧠 Data Flow & Integrity

**Ingest:** Raw data is pulled from external sources.
**Validate:** The Transformer layer runs a Zod schema check. If a data point is corrupted or missing required fields, it is logged and filtered out to prevent "Dirty Data".
**Normalize:** Raw currency strings are converted to Numeric types for financial accuracy.
**Upsert:** Data is pushed to PostgreSQL. Existing records are updated; new records are inserted.
**Sync:** Binary assets (images) are fetched only if they don't already exist in the local storage.

## 🚀 Getting Started

_Clone & Install:_

```Bash
npm install
npx playwright install chromium
```

_Database Setup:_ Ensure PostgreSQL is running and update your .env file based on the provided configuration.

_Execute Pipeline:_

```Bash
node src/index.js
```

## 🛡️ Reliability Features

**Fault Tolerance:** The pipeline skips invalid records instead of crashing.
**Idempotency:** Safe to run multiple times; the final state remains consistent.
**Rate Limiting:** Built-in delays to respect source server resources.

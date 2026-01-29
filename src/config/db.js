require("dotenv").config();
const { Client } = require("pg");

async function createDb() {
  const client = new Client({
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
  });

  await client.connect();
  return client;
}

module.exports = { createDb };

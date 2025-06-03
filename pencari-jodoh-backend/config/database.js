// config/database.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',     // Ganti dengan username database Anda
  host: '127.0.0.1',       // Ganti dengan host database Anda
  database: 'frontend', // Ganti dengan nama database Anda
  password: 'postgres', // Ganti dengan password database Anda
  port: 5432,              // Port default PostgreSQL
});

module.exports = pool;

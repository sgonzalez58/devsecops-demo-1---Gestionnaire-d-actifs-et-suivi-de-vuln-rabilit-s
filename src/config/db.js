require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// test de connexion à la base de données
pool.on('connect', () => {
  console.log('Connexion à la base de données PostgreSQL réussie');
});

pool.on('error', (err) => {
  console.error('Erreur de connexion à la base de données PostgreSQL', err);
  process.exit(-1); // Arrête le processus si la connexion échoue
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool,
};
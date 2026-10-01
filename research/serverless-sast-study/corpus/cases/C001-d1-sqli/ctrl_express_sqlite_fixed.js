// C001-K-F | CWE-89 fixed | calibration: parameterized better-sqlite3 query
import express from 'express';
import Database from 'better-sqlite3';
const app = express();
const db = new Database('corpus.db');

app.get('/api/v1/corpus/c001/products', async (req, res) => {
  const sku = req.query.sku;
  const results = db
    .prepare('SELECT * FROM urunler WHERE sku = ?')
    .all(sku);
  res.json(results);
});

export default app;

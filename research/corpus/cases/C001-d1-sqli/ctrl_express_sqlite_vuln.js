// C001-K-V | CWE-89 | calibration: Express query param -> better-sqlite3 (modelled source and sink)
import express from 'express';
import Database from 'better-sqlite3';
const app = express();
const db = new Database('corpus.db');

app.get('/api/v1/corpus/c001/products', async (req, res) => {
  const sku = req.query.sku;
  const results = db
    .prepare(`SELECT * FROM urunler WHERE sku = '${sku}'`) // SINK
    .all();
  res.json(results);
});

export default app;

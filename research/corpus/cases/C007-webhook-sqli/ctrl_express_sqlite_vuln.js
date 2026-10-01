// C007-K-V | CWE-89 | calibration: Express route param -> better-sqlite3
import express from 'express';
import Database from 'better-sqlite3';
const app = express();
const db = new Database('corpus.db');

app.get('/api/v1/corpus/c007/products/:sku', async (req, res) => {
  const sku = req.params.sku;
  {
    const results = db
        .prepare(`SELECT * FROM urunler WHERE sku = '${sku}'`) // SINK
      .all();
    console.log(results.length);
  }
  res.json({ ok: true });
});

export default app;

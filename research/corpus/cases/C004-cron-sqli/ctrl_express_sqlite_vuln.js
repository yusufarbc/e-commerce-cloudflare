// C004-K-V | CWE-89 | calibration: Express JSON body -> better-sqlite3
import express from 'express';
import Database from 'better-sqlite3';
const app = express();
const db = new Database('corpus.db');

app.post('/api/v1/corpus/c004/sync', express.json(), async (req, res) => {
  const feed = req.body;
  for (const item of feed.items) {
    const sku = item.sku;
    const results = db
        .prepare(`SELECT * FROM urunler WHERE sku = '${sku}'`) // SINK
      .all();
    console.log(results.length);
  }
  res.json({ ok: true });
});

export default app;

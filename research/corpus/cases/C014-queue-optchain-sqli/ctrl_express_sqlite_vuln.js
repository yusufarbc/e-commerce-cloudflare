// C014-K-V | CWE-89 | calibration: Express body -> better-sqlite3 (optional chaining; author-written held-out)
import express from 'express';
import Database from 'better-sqlite3';
const app = express();
const db = new Database('corpus.db');

app.post('/api/v1/corpus/c014/run', express.json(), async (req, res) => {
  const input = req.body;
  {
    const ref = input.order?.item?.sku ?? '';
    const results = db
        .prepare(`SELECT * FROM urunler WHERE sku = '${ref}'`) // SINK
        .all();
    console.log(results.length);
  }
  res.json({ ok: true });
});

export default app;

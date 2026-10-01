// C012-K-F | CWE-89 | fixed: calibration: Express body -> better-sqlite3 (object spread; author-written held-out)
import express from 'express';
import Database from 'better-sqlite3';
const app = express();
const db = new Database('corpus.db');

const DEFAULTS = { sku: 'A-100' };

app.post('/api/v1/corpus/c012/run', express.json(), async (req, res) => {
  const input = req.body;
  {
    const { sku: ref } = { ...DEFAULTS, ...input };
    const results = db
        .prepare('SELECT * FROM urunler WHERE sku = ?')
        .all(ref);
    console.log(results.length);
  }
  res.json({ ok: true });
});

export default app;

// C011-K-F | CWE-89 | fixed: calibration: Express body -> better-sqlite3 (helper function; author-written held-out)
import express from 'express';
import Database from 'better-sqlite3';
const app = express();
const db = new Database('corpus.db');

function pickSku(input) {
  return input.sku;
}

app.post('/api/v1/corpus/c011/run', express.json(), async (req, res) => {
  const input = req.body;
  {
    const ref = pickSku(input);
    const results = db
        .prepare('SELECT * FROM urunler WHERE sku = ?')
        .all(ref);
    console.log(results.length);
  }
  res.json({ ok: true });
});

export default app;

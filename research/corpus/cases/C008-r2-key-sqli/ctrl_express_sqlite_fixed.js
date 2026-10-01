// C008-K-F | CWE-89 | fixed: calibration: Express body -> better-sqlite3 (object key split; dev)
import express from 'express';
import Database from 'better-sqlite3';
const app = express();
const db = new Database('corpus.db');

app.post('/api/v1/corpus/c008/run', express.json(), async (req, res) => {
  const input = req.body;
  {
    const ref = input.key.split('/')[1].replace('.json', '');
    const results = db
        .prepare('SELECT * FROM urunler WHERE sku = ?')
        .all(ref);
    console.log(results.length);
  }
  res.json({ ok: true });
});

export default app;

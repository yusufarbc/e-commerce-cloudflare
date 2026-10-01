// X001-K-V | CWE-89 | calibration: Express query -> receipt key -> better-sqlite3
// held-out, external: pattern adapted from OWASP DVSA send_receipt_email (S3 receipt key -> decode -> split -> sink); code written for this corpus
import express from 'express';
import Database from 'better-sqlite3';
const app = express();
const db = new Database('corpus.db');

// Receipt keys look like 2026/10/02/<orderRef>.raw and arrive URL-encoded.
function orderRefFromKey(rawKey) {
  const key = decodeURIComponent(rawKey);
  return key.split('/')[3].replace('.raw', '');
}

app.get('/api/v1/corpus/x001/receipts', async (req, res) => {
  {
    const ref = orderRefFromKey(req.query.key);
    const results = db
        .prepare(`SELECT * FROM urunler WHERE sku = '${ref}'`) // SINK
        .all();
    console.log(results.length);
  }
  res.json({ ok: true });
});

export default app;

// X004-K-V | CWE-89 | calibration: Express body (job list) -> better-sqlite3
// held-out, external: pattern adapted from CloudBench dynamodb-service api-put-item + OWASP DVSA cron_processor (stored data read by cron); code written for this corpus
import express from 'express';
import Database from 'better-sqlite3';
const app = express();
const db = new Database('corpus.db');

app.post('/api/v1/corpus/x004/jobs/run', express.json(), async (req, res) => {
  for (const job of req.body.jobs) {
    const ref = job.note;
    const results = db
        .prepare(`SELECT * FROM urunler WHERE sku = '${ref}'`) // SINK
        .all();
    console.log(results.length);
  }
  res.json({ ok: true });
});

export default app;

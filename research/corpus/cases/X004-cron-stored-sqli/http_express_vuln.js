// X004-E-V | CWE-89 | Express body (job list) -> D1
// held-out, external: pattern adapted from CloudBench dynamodb-service api-put-item + OWASP DVSA cron_processor (stored data read by cron); code written for this corpus
import express from 'express';
const app = express();

app.post('/api/v1/corpus/x004/jobs/run', express.json(), async (req, res) => {
  for (const job of req.body.jobs) {
    const ref = job.note;
    const { results } = await req.app.locals.env.DB
        .prepare(`SELECT * FROM urunler WHERE sku = '${ref}'`) // SINK
        .all();
    console.log(results.length);
  }
  res.json({ ok: true });
});

export default app;

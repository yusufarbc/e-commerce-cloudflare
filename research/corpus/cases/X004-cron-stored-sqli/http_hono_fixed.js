// X004-H-F | CWE-89 | Hono body (job list) -> D1
// held-out, external: pattern adapted from CloudBench dynamodb-service api-put-item + OWASP DVSA cron_processor (stored data read by cron); code written for this corpus
import { Hono } from 'hono';
const app = new Hono();

app.post('/api/v1/corpus/x004/jobs/run', async (c) => {
  const { jobs } = await c.req.json();
  for (const job of jobs) {
    const ref = job.note;
    const { results } = await c.env.DB
        .prepare('SELECT * FROM urunler WHERE sku = ?')
        .bind(ref)
        .all();
    console.log(results.length);
  }
  return c.json({ ok: true });
});

export default app;

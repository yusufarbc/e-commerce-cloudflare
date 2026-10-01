// X001-H-V | CWE-89 | Hono query -> receipt key -> D1
// held-out, external: pattern adapted from OWASP DVSA send_receipt_email (S3 receipt key -> decode -> split -> sink); code written for this corpus
import { Hono } from 'hono';
const app = new Hono();

// Receipt keys look like 2026/10/02/<orderRef>.raw and arrive URL-encoded.
function orderRefFromKey(rawKey) {
  const key = decodeURIComponent(rawKey);
  return key.split('/')[3].replace('.raw', '');
}

app.get('/api/v1/corpus/x001/receipts', async (c) => {
  {
    const ref = orderRefFromKey(c.req.query('key'));
    const { results } = await c.env.DB
        .prepare(`SELECT * FROM urunler WHERE sku = '${ref}'`) // SINK
        .all();
    console.log(results.length);
  }
  return c.json({ ok: true });
});

export default app;

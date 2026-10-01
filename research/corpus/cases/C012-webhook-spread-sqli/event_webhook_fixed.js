// C012-W-F | CWE-89 | fixed: webhook payload -> platform sink (object spread; author-written held-out)
import { Hono } from 'hono';
const app = new Hono();

const DEFAULTS = { sku: 'A-100' };

app.post('/api/v1/corpus/c012/webhooks/partner', async (c) => {
  const input = (await c.req.json()).data;
  {
    const { sku: ref } = { ...DEFAULTS, ...input };
    const { results } = await c.env.DB
        .prepare('SELECT * FROM urunler WHERE sku = ?')
        .bind(ref)
        .all();
    console.log(results.length);
  }
  return c.json({ received: true });
});

export default app;

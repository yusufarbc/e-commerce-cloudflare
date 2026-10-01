// C004-H-V | CWE-89 | Hono source -> D1
import { Hono } from 'hono';
const app = new Hono();

app.post('/api/v1/corpus/c004/sync', async (c) => {
  const feed = await c.req.json();
  for (const item of feed.items) {
    const sku = item.sku;
    const { results } = await c.env.DB
        .prepare(`SELECT * FROM urunler WHERE sku = '${sku}'`) // SINK
        .all();
    console.log(results.length);
  }
  return c.json({ ok: true });
});

export default app;

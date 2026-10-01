// C007-H-V | CWE-89 | Hono source -> D1
import { Hono } from 'hono';
const app = new Hono();

app.get('/api/v1/corpus/c007/products/:sku', async (c) => {
  const sku = c.req.param('sku');
  {
    const { results } = await c.env.DB
        .prepare(`SELECT * FROM urunler WHERE sku = '${sku}'`) // SINK
        .all();
    console.log(results.length);
  }
  return c.json({ ok: true });
});

export default app;

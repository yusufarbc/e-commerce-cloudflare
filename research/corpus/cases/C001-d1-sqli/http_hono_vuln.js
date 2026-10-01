// C001-H-V | CWE-89 | source: HTTP query param -> D1 raw SQL
import { Hono } from 'hono';
const app = new Hono();

app.get('/api/v1/corpus/c001/products', async (c) => {
  const sku = c.req.query('sku');
  const { results } = await c.env.DB
        .prepare(`SELECT * FROM urunler WHERE sku = '${sku}'`) // SINK
        .all();
  return c.json(results);
});

export default app;

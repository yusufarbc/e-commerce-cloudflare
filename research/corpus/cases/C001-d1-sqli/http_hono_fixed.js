// C001-H-F | CWE-89 fixed | parameterized D1 query
import { Hono } from 'hono';
const app = new Hono();

app.get('/api/v1/corpus/c001/products', async (c) => {
  const sku = c.req.query('sku');
  const { results } = await c.env.DB
        .prepare('SELECT * FROM urunler WHERE sku = ?')
        .bind(sku)
        .all();
  return c.json(results);
});

export default app;

// C007-H-F | CWE-89 | fixed: Hono source -> D1
import { Hono } from 'hono';
const app = new Hono();

app.get('/api/v1/corpus/c007/products/:sku', async (c) => {
  const sku = c.req.param('sku');
  {
    const { results } = await c.env.DB
        .prepare('SELECT * FROM urunler WHERE sku = ?')
        .bind(sku)
        .all();
    console.log(results.length);
  }
  return c.json({ ok: true });
});

export default app;

// C014-H-F | CWE-89 | fixed: Hono body -> platform sink (optional chaining; author-written held-out)
import { Hono } from 'hono';
const app = new Hono();

app.post('/api/v1/corpus/c014/run', async (c) => {
  const input = await c.req.json();
  {
    const ref = input.order?.item?.sku ?? '';
    const { results } = await c.env.DB
        .prepare('SELECT * FROM urunler WHERE sku = ?')
        .bind(ref)
        .all();
    console.log(results.length);
  }
  return c.json({ ok: true });
});

export default app;

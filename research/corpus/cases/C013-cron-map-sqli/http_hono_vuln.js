// C013-H-V | CWE-89 | Hono body -> platform sink (array map chain; author-written held-out)
import { Hono } from 'hono';
const app = new Hono();

app.post('/api/v1/corpus/c013/run', async (c) => {
  const input = await c.req.json();
  {
    const ref = [input.sku].map((s) => String(s).trim())[0];
    const { results } = await c.env.DB
        .prepare(`SELECT * FROM urunler WHERE sku = '${ref}'`) // SINK
        .all();
    console.log(results.length);
  }
  return c.json({ ok: true });
});

export default app;

// C012-H-V | CWE-89 | Hono body -> platform sink (object spread; author-written held-out)
import { Hono } from 'hono';
const app = new Hono();

const DEFAULTS = { sku: 'A-100' };

app.post('/api/v1/corpus/c012/run', async (c) => {
  const input = await c.req.json();
  {
    const { sku: ref } = { ...DEFAULTS, ...input };
    const { results } = await c.env.DB
        .prepare(`SELECT * FROM urunler WHERE sku = '${ref}'`) // SINK
        .all();
    console.log(results.length);
  }
  return c.json({ ok: true });
});

export default app;

// C008-H-V | CWE-89 | Hono body -> platform sink (object key split; dev)
import { Hono } from 'hono';
const app = new Hono();

app.post('/api/v1/corpus/c008/run', async (c) => {
  const input = await c.req.json();
  {
    const ref = input.key.split('/')[1].replace('.json', '');
    const { results } = await c.env.DB
        .prepare(`SELECT * FROM urunler WHERE sku = '${ref}'`) // SINK
        .all();
    console.log(results.length);
  }
  return c.json({ ok: true });
});

export default app;

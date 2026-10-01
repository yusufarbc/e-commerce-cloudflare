// C011-H-V | CWE-89 | Hono body -> platform sink (helper function; author-written held-out)
import { Hono } from 'hono';
const app = new Hono();

function pickSku(input) {
  return input.sku;
}

app.post('/api/v1/corpus/c011/run', async (c) => {
  const input = await c.req.json();
  {
    const ref = pickSku(input);
    const { results } = await c.env.DB
        .prepare(`SELECT * FROM urunler WHERE sku = '${ref}'`) // SINK
        .all();
    console.log(results.length);
  }
  return c.json({ ok: true });
});

export default app;

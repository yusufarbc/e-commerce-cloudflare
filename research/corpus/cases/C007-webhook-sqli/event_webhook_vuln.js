// C007-W-V | CWE-89 | webhook source -> D1
import { Hono } from 'hono';
const app = new Hono();

app.post('/api/v1/corpus/c007/webhooks/partner', async (c) => {
  const event = await c.req.json();
  {
    const sku = event.data.sku;
    const { results } = await c.env.DB
        .prepare(`SELECT * FROM urunler WHERE sku = '${sku}'`) // SINK
        .all();
    console.log(results.length);
  }
  return c.json({ received: true });
});

export default app;

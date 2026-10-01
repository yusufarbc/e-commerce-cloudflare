// C007-E-V | CWE-89 | Express source -> D1
import express from 'express';
const app = express();

app.get('/api/v1/corpus/c007/products/:sku', async (req, res) => {
  const sku = req.params.sku;
  {
    const { results } = await req.app.locals.env.DB
        .prepare(`SELECT * FROM urunler WHERE sku = '${sku}'`) // SINK
        .all();
    console.log(results.length);
  }
  res.json({ ok: true });
});

export default app;

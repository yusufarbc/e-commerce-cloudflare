// C001-E-V | CWE-89 | source: Express query param -> D1 raw SQL (modelled source, D1 sink)
import express from 'express';
const app = express();

app.get('/api/v1/corpus/c001/products', async (req, res) => {
  const sku = req.query.sku;
  const { results } = await req.app.locals.env.DB
    .prepare(`SELECT * FROM urunler WHERE sku = '${sku}'`) // SINK
    .all();
  res.json(results);
});

export default app;

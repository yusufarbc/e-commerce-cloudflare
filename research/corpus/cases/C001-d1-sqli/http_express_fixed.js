// C001-E-F | CWE-89 fixed | parameterized D1 query behind Express
import express from 'express';
const app = express();

app.get('/api/v1/corpus/c001/products', async (req, res) => {
  const sku = req.query.sku;
  const { results } = await req.app.locals.env.DB
        .prepare('SELECT * FROM urunler WHERE sku = ?')
        .bind(sku)
        .all();
  res.json(results);
});

export default app;

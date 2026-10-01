// C014-E-F | CWE-89 | fixed: Express body -> platform sink (optional chaining; author-written held-out)
import express from 'express';
const app = express();

app.post('/api/v1/corpus/c014/run', express.json(), async (req, res) => {
  const input = req.body;
  {
    const ref = input.order?.item?.sku ?? '';
    const { results } = await req.app.locals.env.DB
        .prepare('SELECT * FROM urunler WHERE sku = ?')
        .bind(ref)
        .all();
    console.log(results.length);
  }
  res.json({ ok: true });
});

export default app;

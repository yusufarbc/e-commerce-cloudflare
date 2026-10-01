// C013-E-F | CWE-89 | fixed: Express body -> platform sink (array map chain; author-written held-out)
import express from 'express';
const app = express();

app.post('/api/v1/corpus/c013/run', express.json(), async (req, res) => {
  const input = req.body;
  {
    const ref = [input.sku].map((s) => String(s).trim())[0];
    const { results } = await req.app.locals.env.DB
        .prepare('SELECT * FROM urunler WHERE sku = ?')
        .bind(ref)
        .all();
    console.log(results.length);
  }
  res.json({ ok: true });
});

export default app;

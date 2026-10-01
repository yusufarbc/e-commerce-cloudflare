// C008-E-F | CWE-89 | fixed: Express body -> platform sink (object key split; dev)
import express from 'express';
const app = express();

app.post('/api/v1/corpus/c008/run', express.json(), async (req, res) => {
  const input = req.body;
  {
    const ref = input.key.split('/')[1].replace('.json', '');
    const { results } = await req.app.locals.env.DB
        .prepare('SELECT * FROM urunler WHERE sku = ?')
        .bind(ref)
        .all();
    console.log(results.length);
  }
  res.json({ ok: true });
});

export default app;

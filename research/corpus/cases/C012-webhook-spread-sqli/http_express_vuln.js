// C012-E-V | CWE-89 | Express body -> platform sink (object spread; author-written held-out)
import express from 'express';
const app = express();

const DEFAULTS = { sku: 'A-100' };

app.post('/api/v1/corpus/c012/run', express.json(), async (req, res) => {
  const input = req.body;
  {
    const { sku: ref } = { ...DEFAULTS, ...input };
    const { results } = await req.app.locals.env.DB
        .prepare(`SELECT * FROM urunler WHERE sku = '${ref}'`) // SINK
        .all();
    console.log(results.length);
  }
  res.json({ ok: true });
});

export default app;

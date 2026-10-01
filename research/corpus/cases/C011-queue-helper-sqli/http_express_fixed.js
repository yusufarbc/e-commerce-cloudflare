// C011-E-F | CWE-89 | fixed: Express body -> platform sink (helper function; author-written held-out)
import express from 'express';
const app = express();

function pickSku(input) {
  return input.sku;
}

app.post('/api/v1/corpus/c011/run', express.json(), async (req, res) => {
  const input = req.body;
  {
    const ref = pickSku(input);
    const { results } = await req.app.locals.env.DB
        .prepare('SELECT * FROM urunler WHERE sku = ?')
        .bind(ref)
        .all();
    console.log(results.length);
  }
  res.json({ ok: true });
});

export default app;

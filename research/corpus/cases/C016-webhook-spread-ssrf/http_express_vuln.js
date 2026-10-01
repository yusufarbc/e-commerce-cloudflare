// C016-E-V | CWE-918 | Express body -> platform sink (object spread; author-written held-out)
import express from 'express';
const app = express();

const DEFAULTS = { callbackUrl: 'https://hooks.partner.example/notify' };

async function notify(url) {
  const response = await fetch(url); // SINK
  return response.status;
}

app.post('/api/v1/corpus/c016/run', express.json(), async (req, res) => {
  const input = req.body;
  {
    const { callbackUrl: url } = { ...DEFAULTS, ...input };
    console.log(await notify(url));
  }
  res.json({ ok: true });
});

export default app;

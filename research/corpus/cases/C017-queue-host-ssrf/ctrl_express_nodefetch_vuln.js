// C017-K-V | CWE-918 | calibration: Express body -> node-fetch (host in template literal; author-written held-out)
import express from 'express';
import fetch from 'node-fetch';
const app = express();

async function notify(url) {
  const response = await fetch(url); // SINK
  return response.status;
}

app.post('/api/v1/corpus/c017/run', express.json(), async (req, res) => {
  const input = req.body;
  {
    const url = `https://${input.host}/callback`;
    console.log(await notify(url));
  }
  res.json({ ok: true });
});

export default app;

// C009-K-V | CWE-918 | calibration: Express body -> node-fetch (feed field; dev)
import express from 'express';
import fetch from 'node-fetch';
const app = express();

async function notify(url) {
  const response = await fetch(url); // SINK
  return response.status;
}

app.post('/api/v1/corpus/c009/run', express.json(), async (req, res) => {
  const input = req.body;
  {
    const url = input.callbackUrl;
    console.log(await notify(url));
  }
  res.json({ ok: true });
});

export default app;

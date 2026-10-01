// C010-K-V | CWE-918 | calibration: Express body -> node-fetch (object key decode; dev)
import express from 'express';
import fetch from 'node-fetch';
const app = express();

async function notify(url) {
  const response = await fetch(url); // SINK
  return response.status;
}

app.post('/api/v1/corpus/c010/run', express.json(), async (req, res) => {
  const input = req.body;
  {
    const url = decodeURIComponent(input.key.split('/')[1]);
    console.log(await notify(url));
  }
  res.json({ ok: true });
});

export default app;

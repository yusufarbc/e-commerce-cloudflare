// C015-E-V | CWE-918 | Express body -> platform sink (base URL concatenation; author-written held-out)
import express from 'express';
const app = express();

async function notify(url) {
  const response = await fetch(url); // SINK
  return response.status;
}

app.post('/api/v1/corpus/c015/run', express.json(), async (req, res) => {
  const input = req.body;
  {
    const url = input.base + '/v1/notify';
    console.log(await notify(url));
  }
  res.json({ ok: true });
});

export default app;

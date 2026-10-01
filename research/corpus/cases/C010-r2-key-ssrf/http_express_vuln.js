// C010-E-V | CWE-918 | Express body -> platform sink (object key decode; dev)
import express from 'express';
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

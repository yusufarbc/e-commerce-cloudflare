// C018-E-V | CWE-918 | Express body -> platform sink (helper function; author-written held-out)
import express from 'express';
const app = express();

function pickUrl(input) {
  return input.callbackUrl;
}

async function notify(url) {
  const response = await fetch(url); // SINK
  return response.status;
}

app.post('/api/v1/corpus/c018/run', express.json(), async (req, res) => {
  const input = req.body;
  {
    const url = pickUrl(input);
    console.log(await notify(url));
  }
  res.json({ ok: true });
});

export default app;

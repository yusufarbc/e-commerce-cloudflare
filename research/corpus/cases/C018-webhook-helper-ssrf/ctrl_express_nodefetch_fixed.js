// C018-K-F | CWE-918 | fixed: calibration: Express body -> node-fetch (helper function; author-written held-out)
import express from 'express';
import fetch from 'node-fetch';
const app = express();

function pickUrl(input) {
  return input.callbackUrl;
}

const ALLOWED_HOSTS = new Set(['hooks.partner.example']);

async function notify(url) {
  if (!ALLOWED_HOSTS.has(new URL(url).hostname)) return null;
  const response = await fetch(url);
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

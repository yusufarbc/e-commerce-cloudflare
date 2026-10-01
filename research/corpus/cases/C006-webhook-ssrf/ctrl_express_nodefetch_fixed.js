// C006-K-F | CWE-918 | calibration fixed: Express -> node-fetch
import express from 'express';
import fetch from 'node-fetch';
const app = express();
const ALLOWED_HOSTS = new Set(['hooks.partner.example']);

async function notifyPartner(url) {
  if (!ALLOWED_HOSTS.has(new URL(url).hostname)) return null;
  const response = await fetch(url);
  return response.status;
}

app.post('/api/v1/corpus/c006/notify', express.json(), async (req, res) => {
  const { notifyUrl: url } = req.body;
  res.json({ status: await notifyPartner(url) });
});

export default app;

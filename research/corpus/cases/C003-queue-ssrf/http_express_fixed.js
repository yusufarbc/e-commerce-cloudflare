// C003-E-F | CWE-918 | fixed: Express source -> fetch
import express from 'express';
const app = express();
const ALLOWED_HOSTS = new Set(['hooks.partner.example']);

async function notifyPartner(url) {
  if (!ALLOWED_HOSTS.has(new URL(url).hostname)) return null;
  const response = await fetch(url);
  return response.status;
}

app.get('/api/v1/corpus/c003/notify', async (req, res) => {
  const url = req.query.callbackUrl;
  res.json({ status: await notifyPartner(url) });
});

export default app;

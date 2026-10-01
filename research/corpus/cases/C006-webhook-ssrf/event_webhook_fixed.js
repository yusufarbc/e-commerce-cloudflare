// C006-W-F | CWE-918 | fixed: webhook payload -> fetch
const ALLOWED_HOSTS = new Set(['hooks.partner.example']);

async function notifyPartner(url) {
  if (!ALLOWED_HOSTS.has(new URL(url).hostname)) return null;
  const response = await fetch(url);
  return response.status;
}

import { Hono } from 'hono';
const app = new Hono();

app.post('/api/v1/corpus/c006/webhooks/partner', async (c) => {
  const event = await c.req.json();
  const url = event.data.notifyUrl;
  return c.json({ status: await notifyPartner(url) });
});

export default app;

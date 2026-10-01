// C006-W-V | CWE-918 | webhook payload -> fetch
async function notifyPartner(url) {
  const response = await fetch(url); // SINK
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

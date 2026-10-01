// C003-H-F | CWE-918 | fixed: Hono source -> fetch
import { Hono } from 'hono';
const app = new Hono();
const ALLOWED_HOSTS = new Set(['hooks.partner.example']);

async function notifyPartner(url) {
  if (!ALLOWED_HOSTS.has(new URL(url).hostname)) return null;
  const response = await fetch(url);
  return response.status;
}

app.get('/api/v1/corpus/c003/notify', async (c) => {
  const url = c.req.query('callbackUrl');
  return c.json({ status: await notifyPartner(url) });
});

export default app;

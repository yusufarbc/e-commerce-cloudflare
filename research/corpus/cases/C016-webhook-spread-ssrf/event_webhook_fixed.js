// C016-W-F | CWE-918 | fixed: webhook payload -> platform sink (object spread; author-written held-out)
import { Hono } from 'hono';
const app = new Hono();

const DEFAULTS = { callbackUrl: 'https://hooks.partner.example/notify' };

const ALLOWED_HOSTS = new Set(['hooks.partner.example']);

async function notify(url) {
  if (!ALLOWED_HOSTS.has(new URL(url).hostname)) return null;
  const response = await fetch(url);
  return response.status;
}

app.post('/api/v1/corpus/c016/webhooks/partner', async (c) => {
  const input = (await c.req.json()).data;
  {
    const { callbackUrl: url } = { ...DEFAULTS, ...input };
    console.log(await notify(url));
  }
  return c.json({ received: true });
});

export default app;

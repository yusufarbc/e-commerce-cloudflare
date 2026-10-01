// C015-H-F | CWE-918 | fixed: Hono body -> platform sink (base URL concatenation; author-written held-out)
import { Hono } from 'hono';
const app = new Hono();

const ALLOWED_HOSTS = new Set(['hooks.partner.example']);

async function notify(url) {
  if (!ALLOWED_HOSTS.has(new URL(url).hostname)) return null;
  const response = await fetch(url);
  return response.status;
}

app.post('/api/v1/corpus/c015/run', async (c) => {
  const input = await c.req.json();
  {
    const url = input.base + '/v1/notify';
    console.log(await notify(url));
  }
  return c.json({ ok: true });
});

export default app;

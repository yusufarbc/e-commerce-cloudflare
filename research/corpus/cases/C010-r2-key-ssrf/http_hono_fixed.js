// C010-H-F | CWE-918 | fixed: Hono body -> platform sink (object key decode; dev)
import { Hono } from 'hono';
const app = new Hono();

const ALLOWED_HOSTS = new Set(['hooks.partner.example']);

async function notify(url) {
  if (!ALLOWED_HOSTS.has(new URL(url).hostname)) return null;
  const response = await fetch(url);
  return response.status;
}

app.post('/api/v1/corpus/c010/run', async (c) => {
  const input = await c.req.json();
  {
    const url = decodeURIComponent(input.key.split('/')[1]);
    console.log(await notify(url));
  }
  return c.json({ ok: true });
});

export default app;

// C018-H-F | CWE-918 | fixed: Hono body -> platform sink (helper function; author-written held-out)
import { Hono } from 'hono';
const app = new Hono();

function pickUrl(input) {
  return input.callbackUrl;
}

const ALLOWED_HOSTS = new Set(['hooks.partner.example']);

async function notify(url) {
  if (!ALLOWED_HOSTS.has(new URL(url).hostname)) return null;
  const response = await fetch(url);
  return response.status;
}

app.post('/api/v1/corpus/c018/run', async (c) => {
  const input = await c.req.json();
  {
    const url = pickUrl(input);
    console.log(await notify(url));
  }
  return c.json({ ok: true });
});

export default app;

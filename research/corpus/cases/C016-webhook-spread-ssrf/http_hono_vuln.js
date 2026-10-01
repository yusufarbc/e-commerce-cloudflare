// C016-H-V | CWE-918 | Hono body -> platform sink (object spread; author-written held-out)
import { Hono } from 'hono';
const app = new Hono();

const DEFAULTS = { callbackUrl: 'https://hooks.partner.example/notify' };

async function notify(url) {
  const response = await fetch(url); // SINK
  return response.status;
}

app.post('/api/v1/corpus/c016/run', async (c) => {
  const input = await c.req.json();
  {
    const { callbackUrl: url } = { ...DEFAULTS, ...input };
    console.log(await notify(url));
  }
  return c.json({ ok: true });
});

export default app;

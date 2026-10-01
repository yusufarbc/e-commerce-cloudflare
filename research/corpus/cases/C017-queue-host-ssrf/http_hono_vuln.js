// C017-H-V | CWE-918 | Hono body -> platform sink (host in template literal; author-written held-out)
import { Hono } from 'hono';
const app = new Hono();

async function notify(url) {
  const response = await fetch(url); // SINK
  return response.status;
}

app.post('/api/v1/corpus/c017/run', async (c) => {
  const input = await c.req.json();
  {
    const url = `https://${input.host}/callback`;
    console.log(await notify(url));
  }
  return c.json({ ok: true });
});

export default app;

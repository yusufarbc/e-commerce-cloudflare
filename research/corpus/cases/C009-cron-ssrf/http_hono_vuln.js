// C009-H-V | CWE-918 | Hono body -> platform sink (feed field; dev)
import { Hono } from 'hono';
const app = new Hono();

async function notify(url) {
  const response = await fetch(url); // SINK
  return response.status;
}

app.post('/api/v1/corpus/c009/run', async (c) => {
  const input = await c.req.json();
  {
    const url = input.callbackUrl;
    console.log(await notify(url));
  }
  return c.json({ ok: true });
});

export default app;

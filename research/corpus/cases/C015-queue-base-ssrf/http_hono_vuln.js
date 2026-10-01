// C015-H-V | CWE-918 | Hono body -> platform sink (base URL concatenation; author-written held-out)
import { Hono } from 'hono';
const app = new Hono();

async function notify(url) {
  const response = await fetch(url); // SINK
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

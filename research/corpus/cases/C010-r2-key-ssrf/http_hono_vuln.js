// C010-H-V | CWE-918 | Hono body -> platform sink (object key decode; dev)
import { Hono } from 'hono';
const app = new Hono();

async function notify(url) {
  const response = await fetch(url); // SINK
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

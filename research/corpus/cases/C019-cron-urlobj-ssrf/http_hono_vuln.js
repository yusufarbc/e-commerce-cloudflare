// C019-H-V | CWE-918 | Hono body -> platform sink (new URL(path, origin); author-written held-out)
import { Hono } from 'hono';
const app = new Hono();

async function notify(url) {
  const response = await fetch(url); // SINK
  return response.status;
}

app.post('/api/v1/corpus/c019/run', async (c) => {
  const input = await c.req.json();
  {
    const url = new URL(input.path, input.origin).toString();
    console.log(await notify(url));
  }
  return c.json({ ok: true });
});

export default app;

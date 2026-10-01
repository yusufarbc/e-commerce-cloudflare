// C018-H-V | CWE-918 | Hono body -> platform sink (helper function; author-written held-out)
import { Hono } from 'hono';
const app = new Hono();

function pickUrl(input) {
  return input.callbackUrl;
}

async function notify(url) {
  const response = await fetch(url); // SINK
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

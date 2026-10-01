// C018-W-V | CWE-918 | webhook payload -> platform sink (helper function; author-written held-out)
import { Hono } from 'hono';
const app = new Hono();

function pickUrl(input) {
  return input.callbackUrl;
}

async function notify(url) {
  const response = await fetch(url); // SINK
  return response.status;
}

app.post('/api/v1/corpus/c018/webhooks/partner', async (c) => {
  const input = (await c.req.json()).data;
  {
    const url = pickUrl(input);
    console.log(await notify(url));
  }
  return c.json({ received: true });
});

export default app;

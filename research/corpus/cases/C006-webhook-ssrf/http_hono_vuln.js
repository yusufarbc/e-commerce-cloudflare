// C006-H-V | CWE-918 | Hono source -> fetch
import { Hono } from 'hono';
const app = new Hono();

async function notifyPartner(url) {
  const response = await fetch(url); // SINK
  return response.status;
}

app.post('/api/v1/corpus/c006/notify', async (c) => {
  const { notifyUrl: url } = await c.req.json();
  return c.json({ status: await notifyPartner(url) });
});

export default app;

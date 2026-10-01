// C003-H-V | CWE-918 | Hono source -> fetch
import { Hono } from 'hono';
const app = new Hono();

async function notifyPartner(url) {
  const response = await fetch(url); // SINK
  return response.status;
}

app.get('/api/v1/corpus/c003/notify', async (c) => {
  const url = c.req.query('callbackUrl');
  return c.json({ status: await notifyPartner(url) });
});

export default app;

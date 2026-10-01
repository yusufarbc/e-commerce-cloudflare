// X003-H-F | CWE-918 | Hono body -> fetch
// held-out, external: pattern adapted from CloudBench inter-procedural/sqs-service api-send-message (HTTP -> queue -> consumer); code written for this corpus
import { Hono } from 'hono';
const app = new Hono();
const ALLOWED_HOSTS = new Set(['hooks.partner.example']);

async function deliverWebhook(url) {
  if (!ALLOWED_HOSTS.has(new URL(url).hostname)) return null;
  const response = await fetch(url);
  return response.status;
}

app.post('/api/v1/corpus/x003/jobs', async (c) => {
  const { webhookUrl } = await c.req.json();
  return c.json({ status: await deliverWebhook(webhookUrl) });
});

export default app;

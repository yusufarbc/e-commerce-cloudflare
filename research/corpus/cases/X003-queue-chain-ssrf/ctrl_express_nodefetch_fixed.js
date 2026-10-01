// X003-K-F | CWE-918 | calibration: Express body -> node-fetch
// held-out, external: pattern adapted from CloudBench inter-procedural/sqs-service api-send-message (HTTP -> queue -> consumer); code written for this corpus
import express from 'express';
import fetch from 'node-fetch';
const app = express();
const ALLOWED_HOSTS = new Set(['hooks.partner.example']);

async function deliverWebhook(url) {
  if (!ALLOWED_HOSTS.has(new URL(url).hostname)) return null;
  const response = await fetch(url);
  return response.status;
}

app.post('/api/v1/corpus/x003/jobs', express.json(), async (req, res) => {
  res.json({ status: await deliverWebhook(req.body.webhookUrl) });
});

export default app;

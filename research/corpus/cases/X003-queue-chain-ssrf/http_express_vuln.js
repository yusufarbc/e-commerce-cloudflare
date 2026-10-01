// X003-E-V | CWE-918 | Express body -> fetch
// held-out, external: pattern adapted from CloudBench inter-procedural/sqs-service api-send-message (HTTP -> queue -> consumer); code written for this corpus
import express from 'express';
const app = express();

async function deliverWebhook(url) {
  const response = await fetch(url); // SINK
  return response.status;
}

app.post('/api/v1/corpus/x003/jobs', express.json(), async (req, res) => {
  res.json({ status: await deliverWebhook(req.body.webhookUrl) });
});

export default app;

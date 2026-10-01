// C003-K-V | CWE-918 | calibration: Express -> node-fetch
import express from 'express';
import fetch from 'node-fetch';
const app = express();

async function notifyPartner(url) {
  const response = await fetch(url); // SINK
  return response.status;
}

app.get('/api/v1/corpus/c003/notify', async (req, res) => {
  const url = req.query.callbackUrl;
  res.json({ status: await notifyPartner(url) });
});

export default app;

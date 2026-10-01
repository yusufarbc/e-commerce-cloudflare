// C006-E-V | CWE-918 | Express source -> fetch
import express from 'express';
const app = express();

async function notifyPartner(url) {
  const response = await fetch(url); // SINK
  return response.status;
}

app.post('/api/v1/corpus/c006/notify', express.json(), async (req, res) => {
  const { notifyUrl: url } = req.body;
  res.json({ status: await notifyPartner(url) });
});

export default app;

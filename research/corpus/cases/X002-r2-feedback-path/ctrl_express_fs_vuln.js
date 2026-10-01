// X002-K-V | CWE-22 | calibration: Express query -> fs.readFileSync
// held-out, external: pattern adapted from OWASP DVSA feedback_uploads + SecBench.js encoded path-traversal payloads; code written for this corpus
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
const app = express();

function readFeedback(baseDir, rawName) {
  const name = decodeURIComponent(rawName);
  const data = fs.readFileSync(path.join(baseDir, 'feedback', name)); // SINK
  return data.toString('utf8');
}

app.get('/api/v1/corpus/x002/feedback', async (req, res) => {
  res.send(readFeedback(req.app.locals.filesDir, req.query.file));
});

export default app;

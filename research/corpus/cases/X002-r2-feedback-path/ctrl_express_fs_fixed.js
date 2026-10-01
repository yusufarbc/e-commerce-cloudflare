// X002-K-F | CWE-22 | calibration: Express query -> fs.readFileSync
// held-out, external: pattern adapted from OWASP DVSA feedback_uploads + SecBench.js encoded path-traversal payloads; code written for this corpus
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
const app = express();

function readFeedback(baseDir, rawName) {
  const name = decodeURIComponent(rawName);
  const dir = path.resolve(baseDir, 'feedback');
  const target = path.resolve(dir, name);
  if (!target.startsWith(dir + path.sep)) return null;
  const data = fs.readFileSync(target);
  return data.toString('utf8');
}

app.get('/api/v1/corpus/x002/feedback', async (req, res) => {
  res.send(readFeedback(req.app.locals.filesDir, req.query.file));
});

export default app;

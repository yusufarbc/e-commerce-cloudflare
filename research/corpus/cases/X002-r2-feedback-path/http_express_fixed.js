// X002-E-F | CWE-22 | Express query -> R2 key
// held-out, external: pattern adapted from OWASP DVSA feedback_uploads + SecBench.js encoded path-traversal payloads; code written for this corpus
import express from 'express';
import path from 'node:path';
const app = express();

async function readFeedback(bucket, rawName) {
  const name = decodeURIComponent(rawName);
  const target = path.posix.join('feedback', name);
  if (!target.startsWith('feedback/')) return null;
  const object = await bucket.get(target);
  return object ? object.text() : null;
}

app.get('/api/v1/corpus/x002/feedback', async (req, res) => {
  res.send(await readFeedback(req.app.locals.env.IMAGES_BUCKET, req.query.file));
});

export default app;

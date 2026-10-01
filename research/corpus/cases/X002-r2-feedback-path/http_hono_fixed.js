// X002-H-F | CWE-22 | Hono query -> R2 key
// held-out, external: pattern adapted from OWASP DVSA feedback_uploads + SecBench.js encoded path-traversal payloads; code written for this corpus
import { Hono } from 'hono';
import path from 'node:path';
const app = new Hono();

async function readFeedback(bucket, rawName) {
  const name = decodeURIComponent(rawName);
  const target = path.posix.join('feedback', name);
  if (!target.startsWith('feedback/')) return null;
  const object = await bucket.get(target);
  return object ? object.text() : null;
}

app.get('/api/v1/corpus/x002/feedback', async (c) => {
  return c.text((await readFeedback(c.env.IMAGES_BUCKET, c.req.query('file'))) ?? '');
});

export default app;

// C002-E-F | CWE-22 | fixed: Express source -> R2 key
import express from 'express';
import path from 'node:path';
const app = express();

async function readPublicObject(bucket, key) {
  const target = path.posix.join('public', key);
  if (!target.startsWith('public/')) return null;
  const object = await bucket.get(target);
  return object ? object.text() : null;
}

app.get('/api/v1/corpus/c002/files', async (req, res) => {
  const key = req.query.key;
  res.send(await readPublicObject(req.app.locals.env.IMAGES_BUCKET, key));
});

export default app;

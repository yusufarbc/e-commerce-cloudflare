// C005-E-F | CWE-22 | fixed: Express source -> R2 key
import express from 'express';
import path from 'node:path';
const app = express();

async function readPublicObject(bucket, key) {
  const target = path.posix.join('public', key);
  if (!target.startsWith('public/')) return null;
  const object = await bucket.get(target);
  return object ? object.text() : null;
}

app.post('/api/v1/corpus/c005/files', express.json(), async (req, res) => {
  const { key } = req.body;
  res.send(await readPublicObject(req.app.locals.env.IMAGES_BUCKET, key));
});

export default app;

// C005-E-V | CWE-22 | Express source -> R2 key
import express from 'express';
import path from 'node:path';
const app = express();

async function readPublicObject(bucket, key) {
  const object = await bucket.get(path.posix.join('public', key)); // SINK
  return object ? object.text() : null;
}

app.post('/api/v1/corpus/c005/files', express.json(), async (req, res) => {
  const { key } = req.body;
  res.send(await readPublicObject(req.app.locals.env.IMAGES_BUCKET, key));
});

export default app;

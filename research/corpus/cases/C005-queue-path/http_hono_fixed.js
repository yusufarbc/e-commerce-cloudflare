// C005-H-F | CWE-22 | fixed: Hono source -> R2 key
import { Hono } from 'hono';
import path from 'node:path';
const app = new Hono();

async function readPublicObject(bucket, key) {
  const target = path.posix.join('public', key);
  if (!target.startsWith('public/')) return null;
  const object = await bucket.get(target);
  return object ? object.text() : null;
}

app.post('/api/v1/corpus/c005/files', async (c) => {
  const { key } = await c.req.json();
  return c.text((await readPublicObject(c.env.IMAGES_BUCKET, key)) ?? '');
});

export default app;

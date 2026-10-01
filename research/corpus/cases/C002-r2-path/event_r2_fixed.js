// C002-R-F | CWE-22 | fixed: R2 event notification (object key) -> R2 key
import path from 'node:path';

async function readPublicObject(bucket, key) {
  const target = path.posix.join('public', key);
  if (!target.startsWith('public/')) return null;
  const object = await bucket.get(target);
  return object ? object.text() : null;
}

export default {
  async queue(batch, env) {
    for (const msg of batch.messages) {
    const key = msg.body.object.key;
      console.log(await readPublicObject(env.IMAGES_BUCKET, key));
      msg.ack();
    }
  },
};

// C005-Q-F | CWE-22 | fixed: Queue message body -> R2 key
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
    const { key } = msg.body;
      console.log(await readPublicObject(env.IMAGES_BUCKET, key));
      msg.ack();
    }
  },
};

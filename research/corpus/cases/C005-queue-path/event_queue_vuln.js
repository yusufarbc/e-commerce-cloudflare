// C005-Q-V | CWE-22 | Queue message body -> R2 key
import path from 'node:path';

async function readPublicObject(bucket, key) {
  const object = await bucket.get(path.posix.join('public', key)); // SINK
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

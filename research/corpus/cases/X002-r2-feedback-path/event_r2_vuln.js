// X002-R-V | CWE-22 | R2 event notification (uploaded feedback key, URL-encoded) -> R2 key
// held-out, external: pattern adapted from OWASP DVSA feedback_uploads + SecBench.js encoded path-traversal payloads; code written for this corpus
import path from 'node:path';

async function readFeedback(bucket, rawName) {
  const name = decodeURIComponent(rawName);
  const object = await bucket.get(path.posix.join('feedback', name)); // SINK
  return object ? object.text() : null;
}

export default {
  async queue(batch, env) {
    for (const msg of batch.messages) {
      const rawName = msg.body.object.key.split('/').pop();
      console.log(await readFeedback(env.IMAGES_BUCKET, rawName));
      msg.ack();
    }
  },
};

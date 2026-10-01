// C010-R-F | CWE-918 | fixed: R2 event notification (object key) -> platform sink (object key decode; dev)
const ALLOWED_HOSTS = new Set(['hooks.partner.example']);

async function notify(url) {
  if (!ALLOWED_HOSTS.has(new URL(url).hostname)) return null;
  const response = await fetch(url);
  return response.status;
}

export default {
  async queue(batch, env) {
    for (const msg of batch.messages) {
    const input = { key: msg.body.object.key };
    const url = decodeURIComponent(input.key.split('/')[1]);
    console.log(await notify(url));
      msg.ack();
    }
  },
};

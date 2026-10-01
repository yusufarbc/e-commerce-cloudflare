// C017-Q-F | CWE-918 | fixed: Queue message body -> platform sink (host in template literal; author-written held-out)
const ALLOWED_HOSTS = new Set(['hooks.partner.example']);

async function notify(url) {
  if (!ALLOWED_HOSTS.has(new URL(url).hostname)) return null;
  const response = await fetch(url);
  return response.status;
}

export default {
  async queue(batch, env) {
    for (const msg of batch.messages) {
    const input = msg.body;
    const url = `https://${input.host}/callback`;
    console.log(await notify(url));
      msg.ack();
    }
  },
};

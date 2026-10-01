// C003-Q-F | CWE-918 | fixed: Queue message body -> fetch
const ALLOWED_HOSTS = new Set(['hooks.partner.example']);

async function notifyPartner(url) {
  if (!ALLOWED_HOSTS.has(new URL(url).hostname)) return null;
  const response = await fetch(url);
  return response.status;
}

export default {
  async queue(batch, env) {
    for (const msg of batch.messages) {
      const url = msg.body.callbackUrl;
      console.log(await notifyPartner(url));
      msg.ack();
    }
  },
};

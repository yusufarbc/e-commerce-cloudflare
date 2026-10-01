// C003-Q-V | CWE-918 | Queue message body -> fetch
async function notifyPartner(url) {
  const response = await fetch(url); // SINK
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

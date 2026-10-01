// C015-Q-V | CWE-918 | Queue message body -> platform sink (base URL concatenation; author-written held-out)
async function notify(url) {
  const response = await fetch(url); // SINK
  return response.status;
}

export default {
  async queue(batch, env) {
    for (const msg of batch.messages) {
    const input = msg.body;
    const url = input.base + '/v1/notify';
    console.log(await notify(url));
      msg.ack();
    }
  },
};

// C010-R-V | CWE-918 | R2 event notification (object key) -> platform sink (object key decode; dev)
async function notify(url) {
  const response = await fetch(url); // SINK
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

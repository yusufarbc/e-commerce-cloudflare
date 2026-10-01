// C011-Q-V | CWE-89 | Queue message body -> platform sink (helper function; author-written held-out)
function pickSku(input) {
  return input.sku;
}

export default {
  async queue(batch, env) {
    for (const msg of batch.messages) {
    const input = msg.body;
    const ref = pickSku(input);
    const { results } = await env.DB
        .prepare(`SELECT * FROM urunler WHERE sku = '${ref}'`) // SINK
        .all();
    console.log(results.length);
      msg.ack();
    }
  },
};

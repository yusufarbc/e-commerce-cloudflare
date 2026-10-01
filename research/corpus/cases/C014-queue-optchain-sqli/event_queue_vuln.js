// C014-Q-V | CWE-89 | Queue message body -> platform sink (optional chaining; author-written held-out)

export default {
  async queue(batch, env) {
    for (const msg of batch.messages) {
    const input = msg.body;
    const ref = input.order?.item?.sku ?? '';
    const { results } = await env.DB
        .prepare(`SELECT * FROM urunler WHERE sku = '${ref}'`) // SINK
        .all();
    console.log(results.length);
      msg.ack();
    }
  },
};

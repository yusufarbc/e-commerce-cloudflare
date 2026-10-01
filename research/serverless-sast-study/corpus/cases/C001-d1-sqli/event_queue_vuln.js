// C001-Q-V | CWE-89 | source: Cloudflare Queue message body -> D1 raw SQL
export default {
  async queue(batch, env) {
    for (const msg of batch.messages) {
      const sku = msg.body.sku;
      const { results } = await env.DB
        .prepare(`SELECT * FROM urunler WHERE sku = '${sku}'`) // SINK
        .all();
      console.log(results.length);
      msg.ack();
    }
  },
};

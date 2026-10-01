// C001-Q-F | CWE-89 fixed | parameterized D1 query in queue consumer
export default {
  async queue(batch, env) {
    for (const msg of batch.messages) {
      const sku = msg.body.sku;
      const { results } = await env.DB
        .prepare('SELECT * FROM urunler WHERE sku = ?')
        .bind(sku)
        .all();
      console.log(results.length);
      msg.ack();
    }
  },
};

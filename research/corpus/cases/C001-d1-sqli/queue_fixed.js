// C001-Q-F | CWE-89 fixed | parameterized D1 query in queue consumer
export default {
  async queue(batch, env) {
    for (const msg of batch.messages) {
      const { sku, stock } = msg.body;
      await env.DB
        .prepare('UPDATE urunler SET stok = ? WHERE sku = ?')
        .bind(Number(stock), String(sku))
        .run();
      msg.ack();
    }
  },
};

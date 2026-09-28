// C001-Q-V | CWE-89 | source: Cloudflare Queue body -> D1 raw SQL
export default {
  async queue(batch, env) {
    for (const msg of batch.messages) {
      const { sku, stock } = msg.body;
      await env.DB
        .prepare(`UPDATE urunler SET stok = ${stock} WHERE sku = '${sku}'`) // SINK
        .run();
      msg.ack();
    }
  },
};

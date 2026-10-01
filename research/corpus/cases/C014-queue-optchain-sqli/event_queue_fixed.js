// C014-Q-F | CWE-89 | fixed: Queue message body -> platform sink (optional chaining; author-written held-out)

export default {
  async queue(batch, env) {
    for (const msg of batch.messages) {
    const input = msg.body;
    const ref = input.order?.item?.sku ?? '';
    const { results } = await env.DB
        .prepare('SELECT * FROM urunler WHERE sku = ?')
        .bind(ref)
        .all();
    console.log(results.length);
      msg.ack();
    }
  },
};

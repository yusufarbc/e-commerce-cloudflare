// C008-R-V | CWE-89 | R2 event notification (object key) -> platform sink (object key split; dev)

export default {
  async queue(batch, env) {
    for (const msg of batch.messages) {
    const input = { key: msg.body.object.key };
    const ref = input.key.split('/')[1].replace('.json', '');
    const { results } = await env.DB
        .prepare(`SELECT * FROM urunler WHERE sku = '${ref}'`) // SINK
        .all();
    console.log(results.length);
      msg.ack();
    }
  },
};

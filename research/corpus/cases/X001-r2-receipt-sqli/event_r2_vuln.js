// X001-R-V | CWE-89 | R2 event notification (receipt object key) -> D1
// held-out, external: pattern adapted from OWASP DVSA send_receipt_email (S3 receipt key -> decode -> split -> sink); code written for this corpus

// Receipt keys look like 2026/10/02/<orderRef>.raw and arrive URL-encoded.
function orderRefFromKey(rawKey) {
  const key = decodeURIComponent(rawKey);
  return key.split('/')[3].replace('.raw', '');
}

export default {
  async queue(batch, env) {
    for (const msg of batch.messages) {
    const ref = orderRefFromKey(msg.body.object.key);
    const { results } = await env.DB
        .prepare(`SELECT * FROM urunler WHERE sku = '${ref}'`) // SINK
        .all();
    console.log(results.length);
      msg.ack();
    }
  },
};

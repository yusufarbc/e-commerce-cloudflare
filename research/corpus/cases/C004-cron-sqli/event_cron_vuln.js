// C004-C-V | CWE-89 | cron source -> D1
export default {
  async scheduled(controller, env) {
    const feed = await (await fetch(env.PARTNER_FEED_URL)).json();
    for (const item of feed.items) {
      const sku = item.sku;
    const { results } = await env.DB
        .prepare(`SELECT * FROM urunler WHERE sku = '${sku}'`) // SINK
        .all();
    console.log(results.length);
    }
  },
};

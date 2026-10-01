// C013-C-V | CWE-89 | cron job reading a partner feed -> platform sink (array map chain; author-written held-out)

export default {
  async scheduled(controller, env) {
    const feed = await (await fetch(env.FEED_URL)).json();
    for (const input of feed.items) {
    const ref = [input.sku].map((s) => String(s).trim())[0];
    const { results } = await env.DB
        .prepare(`SELECT * FROM urunler WHERE sku = '${ref}'`) // SINK
        .all();
    console.log(results.length);
    }
  },
};

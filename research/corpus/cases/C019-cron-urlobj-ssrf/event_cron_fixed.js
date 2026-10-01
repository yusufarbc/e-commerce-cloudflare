// C019-C-F | CWE-918 | fixed: cron job reading a partner feed -> platform sink (new URL(path, origin); author-written held-out)
const ALLOWED_HOSTS = new Set(['hooks.partner.example']);

async function notify(url) {
  if (!ALLOWED_HOSTS.has(new URL(url).hostname)) return null;
  const response = await fetch(url);
  return response.status;
}

export default {
  async scheduled(controller, env) {
    const feed = await (await fetch(env.FEED_URL)).json();
    for (const input of feed.items) {
    const url = new URL(input.path, input.origin).toString();
    console.log(await notify(url));
    }
  },
};

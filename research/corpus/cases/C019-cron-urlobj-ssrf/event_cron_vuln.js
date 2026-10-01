// C019-C-V | CWE-918 | cron job reading a partner feed -> platform sink (new URL(path, origin); author-written held-out)
async function notify(url) {
  const response = await fetch(url); // SINK
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

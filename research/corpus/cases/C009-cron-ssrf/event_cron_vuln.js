// C009-C-V | CWE-918 | cron job reading a partner feed -> platform sink (feed field; dev)
async function notify(url) {
  const response = await fetch(url); // SINK
  return response.status;
}

export default {
  async scheduled(controller, env) {
    const feed = await (await fetch(env.FEED_URL)).json();
    for (const input of feed.items) {
    const url = input.callbackUrl;
    console.log(await notify(url));
    }
  },
};

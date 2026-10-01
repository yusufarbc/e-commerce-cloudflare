// X003-Q-F | CWE-918 | HTTP producer -> Cloudflare Queue -> consumer -> fetch (cross-handler)
// held-out, external: pattern adapted from CloudBench inter-procedural/sqs-service api-send-message (HTTP -> queue -> consumer); code written for this corpus
const ALLOWED_HOSTS = new Set(['hooks.partner.example']);

async function deliverWebhook(url) {
  if (!ALLOWED_HOSTS.has(new URL(url).hostname)) return null;
  const response = await fetch(url);
  return response.status;
}

export default {
  // Producer: accepts a job over HTTP and enqueues it.
  async fetch(request, env) {
    const job = await request.json();
    await env.JOBS.send({ webhookUrl: job.webhookUrl });
    return new Response('queued', { status: 202 });
  },

  // Consumer: delivers queued webhooks.
  async queue(batch) {
    for (const msg of batch.messages) {
      console.log(await deliverWebhook(msg.body.webhookUrl));
      msg.ack();
    }
  },
};

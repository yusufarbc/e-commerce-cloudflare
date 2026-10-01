// X003-Q-V | CWE-918 | HTTP producer -> Cloudflare Queue -> consumer -> fetch (cross-handler)
// held-out, external: pattern adapted from CloudBench inter-procedural/sqs-service api-send-message (HTTP -> queue -> consumer); code written for this corpus
async function deliverWebhook(url) {
  const response = await fetch(url); // SINK
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

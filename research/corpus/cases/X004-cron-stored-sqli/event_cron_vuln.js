// X004-C-V | CWE-89 | cron reads stored job rows (written earlier from user input) -> D1 (second order)
// held-out, external: pattern adapted from CloudBench dynamodb-service api-put-item + OWASP DVSA cron_processor (stored data read by cron); code written for this corpus
export default {
  async scheduled(controller, env) {
    const { results: jobs } = await env.DB.prepare('SELECT note FROM bekleyen_isler').all();
    for (const job of jobs) {
    const ref = job.note;
    const { results } = await env.DB
        .prepare(`SELECT * FROM urunler WHERE sku = '${ref}'`) // SINK
        .all();
    console.log(results.length);
    }
  },
};

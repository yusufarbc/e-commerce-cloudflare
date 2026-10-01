// CWE-918 oracles (C003, C006): an attacker-chosen internal URL must be fetched
// by every vuln arm and never by a fixed arm; the fixed arm still calls the
// allowed partner host.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { load, callExpress, queueBatch } from '../harness.js';

const PAYLOAD = 'http://169.254.169.254/latest/meta-data/';
const ALLOWED = 'https://hooks.partner.example/notify';

let fetched;
beforeEach(() => {
  fetched = [];
  vi.stubGlobal('fetch', vi.fn(async (url) => {
    fetched.push(String(url));
    return new Response('ok', { status: 200 });
  }));
});
afterEach(() => vi.unstubAllGlobals());

const json = (body) => ({ method: 'POST', body: JSON.stringify(body), headers: { 'content-type': 'application/json' } });

const drivers = {
  C003: {
    ctrl: (app, url) => callExpress(app, { path: `/api/v1/corpus/c003/notify?callbackUrl=${encodeURIComponent(url)}` }),
    express: (app, url) => callExpress(app, { path: `/api/v1/corpus/c003/notify?callbackUrl=${encodeURIComponent(url)}` }),
    hono: (app, url) => app.request(`/api/v1/corpus/c003/notify?callbackUrl=${encodeURIComponent(url)}`, {}, {}),
    event: (worker, url) => worker.queue(queueBatch({ callbackUrl: url }), {}),
  },
  C006: {
    ctrl: (app, url) => callExpress(app, { method: 'POST', path: '/api/v1/corpus/c006/notify', body: { notifyUrl: url } }),
    express: (app, url) => callExpress(app, { method: 'POST', path: '/api/v1/corpus/c006/notify', body: { notifyUrl: url } }),
    hono: (app, url) => app.request('/api/v1/corpus/c006/notify', json({ notifyUrl: url }), {}),
    event: (app, url) => app.request('/api/v1/corpus/c006/webhooks/partner', json({ data: { notifyUrl: url } }), {}),
  },
};

const FILES = {
  C003: { dir: 'C003-queue-ssrf', ctrl: 'ctrl_express_nodefetch', express: 'http_express', hono: 'http_hono', event: 'event_queue' },
  C006: { dir: 'C006-webhook-ssrf', ctrl: 'ctrl_express_nodefetch', express: 'http_express', hono: 'http_hono', event: 'event_webhook' },
};

for (const [pair, files] of Object.entries(FILES)) {
  describe(`${pair} (CWE-918)`, () => {
    for (const arm of ['ctrl', 'express', 'hono', 'event']) {
      it(`${arm}: vuln fetches the attacker-chosen internal URL`, async () => {
        await drivers[pair][arm](await load(files.dir, `${files[arm]}_vuln.js`), PAYLOAD);
        expect(fetched).toContain(PAYLOAD);
      });

      it(`${arm}: fixed refuses it but still reaches the allowed host`, async () => {
        const mod = await load(files.dir, `${files[arm]}_fixed.js`);
        await drivers[pair][arm](mod, PAYLOAD);
        expect(fetched).not.toContain(PAYLOAD);
        await drivers[pair][arm](mod, ALLOWED);
        expect(fetched).toContain(ALLOWED);
      });
    }
  });
}

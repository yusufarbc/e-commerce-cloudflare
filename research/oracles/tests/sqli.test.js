// CWE-89 oracles (C001, C004, C007): the injection must return the hidden row
// in every vuln arm and nothing in every fixed arm.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { load, makeD1, callExpress, queueBatch } from '../harness.js';
import { observed, resetObserved, HIDDEN_SKU } from '../shims/sqlite-store.js';

const PAYLOAD = "nope' OR '1'='1";
const leaked = () => observed.rows.some((r) => r.sku === HIDDEN_SKU);

beforeEach(resetObserved);
afterEach(() => vi.unstubAllGlobals());

// Each driver sends PAYLOAD through the arm's source and returns when the sink ran.
const drivers = {
  C001: {
    ctrl: async (app) => callExpress(app, { path: `/api/v1/corpus/c001/products?sku=${encodeURIComponent(PAYLOAD)}` }),
    express: async (app) => { app.locals.env = { DB: makeD1() }; return callExpress(app, { path: `/api/v1/corpus/c001/products?sku=${encodeURIComponent(PAYLOAD)}` }); },
    hono: async (app) => app.request(`/api/v1/corpus/c001/products?sku=${encodeURIComponent(PAYLOAD)}`, {}, { DB: makeD1() }),
    event: async (worker) => worker.queue(queueBatch({ sku: PAYLOAD }), { DB: makeD1() }),
  },
  C004: {
    ctrl: async (app) => callExpress(app, { method: 'POST', path: '/api/v1/corpus/c004/sync', body: { items: [{ sku: PAYLOAD }] } }),
    express: async (app) => { app.locals.env = { DB: makeD1() }; return callExpress(app, { method: 'POST', path: '/api/v1/corpus/c004/sync', body: { items: [{ sku: PAYLOAD }] } }); },
    hono: async (app) => app.request('/api/v1/corpus/c004/sync', { method: 'POST', body: JSON.stringify({ items: [{ sku: PAYLOAD }] }), headers: { 'content-type': 'application/json' } }, { DB: makeD1() }),
    event: async (worker) => {
      vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ items: [{ sku: PAYLOAD }] }))));
      return worker.scheduled({}, { DB: makeD1(), PARTNER_FEED_URL: 'https://feed.partner.example/items.json' });
    },
  },
  C007: {
    ctrl: async (app) => callExpress(app, { path: `/api/v1/corpus/c007/products/${encodeURIComponent(PAYLOAD)}` }),
    express: async (app) => { app.locals.env = { DB: makeD1() }; return callExpress(app, { path: `/api/v1/corpus/c007/products/${encodeURIComponent(PAYLOAD)}` }); },
    hono: async (app) => app.request(`/api/v1/corpus/c007/products/${encodeURIComponent(PAYLOAD)}`, {}, { DB: makeD1() }),
    event: async (app) => app.request('/api/v1/corpus/c007/webhooks/partner', { method: 'POST', body: JSON.stringify({ data: { sku: PAYLOAD } }), headers: { 'content-type': 'application/json' } }, { DB: makeD1() }),
  },
};

const FILES = {
  C001: { dir: 'C001-d1-sqli', ctrl: 'ctrl_express_sqlite', express: 'http_express', hono: 'http_hono', event: 'event_queue' },
  C004: { dir: 'C004-cron-sqli', ctrl: 'ctrl_express_sqlite', express: 'http_express', hono: 'http_hono', event: 'event_cron' },
  C007: { dir: 'C007-webhook-sqli', ctrl: 'ctrl_express_sqlite', express: 'http_express', hono: 'http_hono', event: 'event_webhook' },
};

for (const [pair, files] of Object.entries(FILES)) {
  describe(`${pair} (CWE-89)`, () => {
    for (const arm of ['ctrl', 'express', 'hono', 'event']) {
      it(`${arm}: vuln leaks the hidden row`, async () => {
        await drivers[pair][arm](await load(files.dir, `${files[arm]}_vuln.js`));
        expect(observed.queries.at(-1)).toContain(PAYLOAD);
        expect(leaked()).toBe(true);
      });

      it(`${arm}: fixed resists the same input`, async () => {
        await drivers[pair][arm](await load(files.dir, `${files[arm]}_fixed.js`));
        expect(observed.queries.length).toBeGreaterThan(0);
        expect(observed.queries.at(-1)).not.toContain(PAYLOAD);
        expect(leaked()).toBe(false);
      });
    }
  });
}

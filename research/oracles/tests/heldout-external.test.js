// Oracles for the held-out external cases X001-X004 (patterns adapted from
// OWASP DVSA, CloudBench and SecBench.js). Same contract as the dev oracles:
// every vuln arm is exploitable, every fixed arm resists the same input.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  load, makeD1, makeBucket, makeFilesDir, makeQueue, callExpress, queueBatch, SECRET_KEY, SECRET_TEXT,
} from '../harness.js';
import { observed, resetObserved, HIDDEN_SKU } from '../shims/sqlite-store.js';

const SQLI = "nope' OR '1'='1";
const leaked = () => observed.rows.some((r) => r.sku === HIDDEN_SKU);
const json = (body) => ({ method: 'POST', body: JSON.stringify(body), headers: { 'content-type': 'application/json' } });
const ARMS = ['ctrl', 'express', 'hono', 'event'];

beforeEach(resetObserved);
afterEach(() => vi.unstubAllGlobals());

// ---------------------------------------------------------------- X001 (CWE-89)
describe('X001 receipt key -> D1 (CWE-89, DVSA send_receipt_email)', () => {
  // Receipt key 2026/10/02/<ref>.raw, URL-encoded as in storage notifications.
  const key = encodeURIComponent(`2026/10/02/${SQLI}.raw`);
  const dir = 'X001-r2-receipt-sqli';
  const file = { ctrl: 'ctrl_express_sqlite', express: 'http_express', hono: 'http_hono', event: 'event_r2' };
  const drive = {
    ctrl: (app) => callExpress(app, { path: `/api/v1/corpus/x001/receipts?key=${encodeURIComponent(key)}` }),
    express: (app) => { app.locals.env = { DB: makeD1() }; return callExpress(app, { path: `/api/v1/corpus/x001/receipts?key=${encodeURIComponent(key)}` }); },
    hono: (app) => app.request(`/api/v1/corpus/x001/receipts?key=${encodeURIComponent(key)}`, {}, { DB: makeD1() }),
    event: (w) => w.queue(queueBatch({ action: 'PutObject', object: { key } }), { DB: makeD1() }),
  };
  for (const arm of ARMS) {
    it(`${arm}: vuln leaks the hidden row`, async () => {
      await drive[arm](await load(dir, `${file[arm]}_vuln.js`));
      expect(leaked()).toBe(true);
    });
    it(`${arm}: fixed resists`, async () => {
      await drive[arm](await load(dir, `${file[arm]}_fixed.js`));
      expect(observed.queries.length).toBeGreaterThan(0);
      expect(leaked()).toBe(false);
    });
  }
});

// ---------------------------------------------------------------- X002 (CWE-22)
describe('X002 feedback key -> R2 path (CWE-22, DVSA feedback_uploads + SecBench.js payloads)', () => {
  // Encoded traversal survives the split('/') and is decoded just before the sink.
  const rawName = '..%2Fprivate%2Fadmin-backup.sql';
  const dir = 'X002-r2-feedback-path';
  const file = { ctrl: 'ctrl_express_fs', express: 'http_express', hono: 'http_hono', event: 'event_r2' };
  const q = `/api/v1/corpus/x002/feedback?file=${encodeURIComponent(rawName)}`;
  const drive = {
    ctrl: async (app) => { app.locals.filesDir = makeFilesDir(); const r = await callExpress(app, { path: q }); return r.text.includes(SECRET_TEXT); },
    express: async (app) => { const b = makeBucket(); app.locals.env = { IMAGES_BUCKET: b }; await callExpress(app, { path: q }); return b.requested.includes(SECRET_KEY); },
    hono: async (app) => { const b = makeBucket(); await app.request(q, {}, { IMAGES_BUCKET: b }); return b.requested.includes(SECRET_KEY); },
    event: async (w) => {
      const b = makeBucket();
      await w.queue(queueBatch({ action: 'PutObject', object: { key: `feedback-inbox/${rawName}` } }), { IMAGES_BUCKET: b });
      return b.requested.includes(SECRET_KEY);
    },
  };
  for (const arm of ARMS) {
    it(`${arm}: vuln reads the private object`, async () => {
      expect(await drive[arm](await load(dir, `${file[arm]}_vuln.js`))).toBe(true);
    });
    it(`${arm}: fixed refuses the traversal`, async () => {
      expect(await drive[arm](await load(dir, `${file[arm]}_fixed.js`))).toBe(false);
    });
  }
});

// ---------------------------------------------------------------- X003 (CWE-918)
describe('X003 HTTP -> queue -> consumer -> fetch (CWE-918, CloudBench api-send-message)', () => {
  const PAYLOAD = 'http://169.254.169.254/latest/meta-data/';
  const ALLOWED = 'https://hooks.partner.example/notify';
  const dir = 'X003-queue-chain-ssrf';
  const file = { ctrl: 'ctrl_express_nodefetch', express: 'http_express', hono: 'http_hono', event: 'event_queue' };
  let fetched;
  beforeEach(() => {
    fetched = [];
    vi.stubGlobal('fetch', vi.fn(async (url) => { fetched.push(String(url)); return new Response('ok'); }));
  });
  const drive = {
    ctrl: (app, url) => callExpress(app, { method: 'POST', path: '/api/v1/corpus/x003/jobs', body: { webhookUrl: url } }),
    express: (app, url) => callExpress(app, { method: 'POST', path: '/api/v1/corpus/x003/jobs', body: { webhookUrl: url } }),
    hono: (app, url) => app.request('/api/v1/corpus/x003/jobs', json({ webhookUrl: url }), {}),
    event: async (w, url) => {
      // Full chain: HTTP producer enqueues, then the consumer runs on the sent messages.
      const JOBS = makeQueue();
      await w.fetch(new Request('https://worker.example/jobs', json({ webhookUrl: url })), { JOBS });
      await w.queue(queueBatch(...JOBS.sent), { JOBS });
    },
  };
  for (const arm of ARMS) {
    it(`${arm}: vuln fetches the internal URL`, async () => {
      await drive[arm](await load(dir, `${file[arm]}_vuln.js`), PAYLOAD);
      expect(fetched).toContain(PAYLOAD);
    });
    it(`${arm}: fixed refuses it but reaches the allowed host`, async () => {
      const mod = await load(dir, `${file[arm]}_fixed.js`);
      await drive[arm](mod, PAYLOAD);
      expect(fetched).not.toContain(PAYLOAD);
      await drive[arm](mod, ALLOWED);
      expect(fetched).toContain(ALLOWED);
    });
  }
});

// ---------------------------------------------------------------- X004 (CWE-89, second order)
describe('X004 cron reads stored rows -> D1 (CWE-89, CloudBench put-item + DVSA cron_processor)', () => {
  const dir = 'X004-cron-stored-sqli';
  const file = { ctrl: 'ctrl_express_sqlite', express: 'http_express', hono: 'http_hono', event: 'event_cron' };
  // The stored note was written earlier from user input.
  const storedJobs = `CREATE TABLE bekleyen_isler (note TEXT); INSERT INTO bekleyen_isler VALUES ('${SQLI.replace(/'/g, "''")}');`;
  const body = { jobs: [{ note: SQLI }] };
  const drive = {
    ctrl: (app) => callExpress(app, { method: 'POST', path: '/api/v1/corpus/x004/jobs/run', body }),
    express: (app) => { app.locals.env = { DB: makeD1() }; return callExpress(app, { method: 'POST', path: '/api/v1/corpus/x004/jobs/run', body }); },
    hono: (app) => app.request('/api/v1/corpus/x004/jobs/run', json(body), { DB: makeD1() }),
    event: (w) => w.scheduled({}, { DB: makeD1(storedJobs) }),
  };
  for (const arm of ARMS) {
    it(`${arm}: vuln leaks the hidden row`, async () => {
      await drive[arm](await load(dir, `${file[arm]}_vuln.js`));
      expect(leaked()).toBe(true);
    });
    it(`${arm}: fixed resists`, async () => {
      await drive[arm](await load(dir, `${file[arm]}_fixed.js`));
      expect(observed.queries.length).toBeGreaterThan(0);
      expect(leaked()).toBe(false);
    });
  }
});

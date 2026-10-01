// CWE-22 oracles (C002, C005): a "../" key must reach the private object in
// every vuln arm, and must be refused by every fixed arm.
import { describe, it, expect } from 'vitest';
import { load, makeBucket, makeFilesDir, callExpress, queueBatch, SECRET_KEY, SECRET_TEXT } from '../harness.js';

const PAYLOAD = '../private/admin-backup.sql';

// Each driver returns { secretRead: boolean } for one arm.
const viaBucket = (bucket) => ({ secretRead: bucket.requested.includes(SECRET_KEY) });

const drivers = {
  C002: {
    ctrl: async (app) => {
      app.locals.filesDir = makeFilesDir();
      const res = await callExpress(app, { path: `/api/v1/corpus/c002/files?key=${encodeURIComponent(PAYLOAD)}` });
      return { secretRead: res.text.includes(SECRET_TEXT) };
    },
    express: async (app) => {
      const bucket = makeBucket();
      app.locals.env = { IMAGES_BUCKET: bucket };
      await callExpress(app, { path: `/api/v1/corpus/c002/files?key=${encodeURIComponent(PAYLOAD)}` });
      return viaBucket(bucket);
    },
    hono: async (app) => {
      const bucket = makeBucket();
      await app.request(`/api/v1/corpus/c002/files?key=${encodeURIComponent(PAYLOAD)}`, {}, { IMAGES_BUCKET: bucket });
      return viaBucket(bucket);
    },
    event: async (worker) => {
      const bucket = makeBucket();
      // R2 event notification delivered through a queue: { object: { key } }
      await worker.queue(queueBatch({ action: 'PutObject', object: { key: PAYLOAD } }), { IMAGES_BUCKET: bucket });
      return viaBucket(bucket);
    },
  },
  C005: {
    ctrl: async (app) => {
      app.locals.filesDir = makeFilesDir();
      const res = await callExpress(app, { method: 'POST', path: '/api/v1/corpus/c005/files', body: { key: PAYLOAD } });
      return { secretRead: res.text.includes(SECRET_TEXT) };
    },
    express: async (app) => {
      const bucket = makeBucket();
      app.locals.env = { IMAGES_BUCKET: bucket };
      await callExpress(app, { method: 'POST', path: '/api/v1/corpus/c005/files', body: { key: PAYLOAD } });
      return viaBucket(bucket);
    },
    hono: async (app) => {
      const bucket = makeBucket();
      await app.request('/api/v1/corpus/c005/files', { method: 'POST', body: JSON.stringify({ key: PAYLOAD }), headers: { 'content-type': 'application/json' } }, { IMAGES_BUCKET: bucket });
      return viaBucket(bucket);
    },
    event: async (worker) => {
      const bucket = makeBucket();
      await worker.queue(queueBatch({ key: PAYLOAD }), { IMAGES_BUCKET: bucket });
      return viaBucket(bucket);
    },
  },
};

const FILES = {
  C002: { dir: 'C002-r2-path', ctrl: 'ctrl_express_fs', express: 'http_express', hono: 'http_hono', event: 'event_r2' },
  C005: { dir: 'C005-queue-path', ctrl: 'ctrl_express_fs', express: 'http_express', hono: 'http_hono', event: 'event_queue' },
};

for (const [pair, files] of Object.entries(FILES)) {
  describe(`${pair} (CWE-22)`, () => {
    for (const arm of ['ctrl', 'express', 'hono', 'event']) {
      it(`${arm}: vuln reads the private object`, async () => {
        const { secretRead } = await drivers[pair][arm](await load(files.dir, `${files[arm]}_vuln.js`));
        expect(secretRead).toBe(true);
      });

      it(`${arm}: fixed refuses the traversal`, async () => {
        const { secretRead } = await drivers[pair][arm](await load(files.dir, `${files[arm]}_fixed.js`));
        expect(secretRead).toBe(false);
      });
    }
  });
}

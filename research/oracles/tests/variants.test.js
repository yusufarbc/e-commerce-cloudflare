// Manifest-driven oracles for the SQL/SSRF variants C008-C019
// (manifest/variants.json is written by the case generator).
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'node:fs';
import { load, makeD1, callExpress, queueBatch } from '../harness.js';
import { observed, resetObserved, HIDDEN_SKU } from '../shims/sqlite-store.js';

const manifest = JSON.parse(fs.readFileSync(new URL('../manifest/variants.json', import.meta.url), 'utf8'));
const FEED_URL = 'https://feed.partner.example/items.json';
const ARMS = ['ctrl', 'express', 'hono', 'event'];
const json = (body) => ({ method: 'POST', body: JSON.stringify(body), headers: { 'content-type': 'application/json' } });

let fetched;
let feedItems;
beforeEach(() => {
  resetObserved();
  fetched = [];
  feedItems = [];
  vi.stubGlobal('fetch', vi.fn(async (url) => {
    const target = String(url);
    if (target === FEED_URL) return new Response(JSON.stringify({ items: feedItems }));
    fetched.push(target);
    return new Response('ok');
  }));
});
afterEach(() => vi.unstubAllGlobals());

// Sends `input` through one arm's source.
async function drive(entry, arm, mod, input) {
  const env = entry.kind === 'sql' ? { DB: makeD1(), FEED_URL } : { FEED_URL };
  if (arm === 'ctrl') return callExpress(mod, { method: 'POST', path: entry.route, body: input });
  if (arm === 'express') { mod.locals.env = env; return callExpress(mod, { method: 'POST', path: entry.route, body: input }); }
  if (arm === 'hono') return mod.request(entry.route, json(input), env);
  switch (entry.event) {
    case 'queue': return mod.queue(queueBatch(input), env);
    case 'r2': return mod.queue(queueBatch({ action: 'PutObject', object: { key: input.key } }), env);
    case 'cron': feedItems = [input]; return mod.scheduled({}, env);
    case 'webhook': return mod.request(entry.webhookRoute, json({ data: input }), env);
    default: throw new Error(`unknown event ${entry.event}`);
  }
}

const leakedRow = () => observed.rows.some((r) => r.sku === HIDDEN_SKU);
const hitMetadata = () => fetched.some((u) => new URL(u).hostname === '169.254.169.254');
const hitAllowed = () => fetched.some((u) => new URL(u).hostname === 'hooks.partner.example');

for (const entry of manifest) {
  describe(`${entry.pair} (${entry.kind}, ${entry.event}, ${entry.flow})`, () => {
    for (const arm of ARMS) {
      const file = (v) => `${entry.files[arm]}_${v}.js`;

      it(`${arm}: vuln is exploitable`, async () => {
        await drive(entry, arm, await load(entry.dir, file('vuln')), entry.attack);
        if (entry.kind === 'sql') expect(leakedRow()).toBe(true);
        else expect(hitMetadata()).toBe(true);
      });

      it(`${arm}: fixed resists the same input`, async () => {
        const mod = await load(entry.dir, file('fixed'));
        await drive(entry, arm, mod, entry.attack);
        if (entry.kind === 'sql') {
          expect(observed.queries.length).toBeGreaterThan(0);
          expect(leakedRow()).toBe(false);
        } else {
          expect(hitMetadata()).toBe(false);
          await drive(entry, arm, mod, entry.allowed);
          expect(hitAllowed()).toBe(true);
        }
      });
    }
  });
}

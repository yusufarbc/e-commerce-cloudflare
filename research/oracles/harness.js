import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { freshCatalogue, record } from './shims/sqlite-store.js';

export const CASES = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../corpus/cases');

export const load = async (pair, file) => (await import(path.join(CASES, pair, file))).default;

// ---- Cloudflare bindings ----------------------------------------------------
export function makeD1(extraSql = '') {
  const db = freshCatalogue();
  if (extraSql) db.exec(extraSql);
  return {
    prepare(sql) {
      let params = [];
      return {
        bind(...p) { params = p; return this; },
        async all() {
          const results = db.prepare(sql).all(...params);
          record(sql, results);
          return { results };
        },
      };
    },
  };
}

export const SECRET_KEY = 'private/admin-backup.sql';
export const SECRET_TEXT = 'TOP-SECRET-BACKUP';

export function makeBucket() {
  const objects = new Map([
    ['public/logo.png', 'public logo'],
    [SECRET_KEY, SECRET_TEXT],
  ]);
  const requested = [];
  return {
    requested,
    async get(key) {
      requested.push(key);
      return objects.has(key) ? { key, text: async () => objects.get(key) } : null;
    },
  };
}

export function makeFilesDir() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'oracle-files-'));
  fs.mkdirSync(path.join(dir, 'public'));
  fs.mkdirSync(path.join(dir, 'private'));
  fs.mkdirSync(path.join(dir, 'feedback'));
  fs.writeFileSync(path.join(dir, 'feedback', 'note.txt'), 'thanks');
  fs.writeFileSync(path.join(dir, 'public', 'logo.png'), 'public logo');
  fs.writeFileSync(path.join(dir, SECRET_KEY), SECRET_TEXT);
  return dir;
}

// Queue producer binding that records sent messages for a later consumer call.
export function makeQueue() {
  const sent = [];
  return { sent, async send(body) { sent.push(body); } };
}

export function queueBatch(...bodies) {
  return { messages: bodies.map((body) => ({ body, ack() {} })) };
}

// ---- Express without a network client (fetch may be stubbed) ----------------
export async function callExpress(app, { method = 'GET', path: url, body } = {}) {
  const server = app.listen(0);
  await new Promise((r) => server.once('listening', r));
  const { port } = server.address();
  try {
    return await new Promise((resolve, reject) => {
      const payload = body === undefined ? null : JSON.stringify(body);
      const req = http.request({ host: '127.0.0.1', port, method, path: url,
        headers: payload ? { 'content-type': 'application/json', 'content-length': Buffer.byteLength(payload) } : {} },
      (res) => {
        let text = '';
        res.on('data', (c) => { text += c; });
        res.on('end', () => resolve({ status: res.statusCode, text }));
      });
      req.on('error', reject);
      if (payload) req.write(payload);
      req.end();
    });
  } finally {
    server.close();
  }
}

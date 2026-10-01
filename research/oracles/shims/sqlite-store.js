// Shared in-memory catalogue used by both the D1 mock and the better-sqlite3 shim.
import { DatabaseSync } from 'node:sqlite';

export const HIDDEN_SKU = 'S3CRET-ROW';

export function freshCatalogue() {
  const db = new DatabaseSync(':memory:');
  db.exec(`
    CREATE TABLE urunler (sku TEXT, ad TEXT, gizli INTEGER);
    INSERT INTO urunler VALUES ('A-100', 'Public product', 0);
    INSERT INTO urunler VALUES ('${HIDDEN_SKU}', 'Hidden product', 1);
  `);
  return db;
}

// Rows returned by the most recent query, for both mocks.
export const observed = { rows: [], queries: [] };

export function record(sql, rows) {
  observed.queries.push(sql);
  observed.rows = rows;
}

export function resetObserved() {
  observed.rows = [];
  observed.queries = [];
}

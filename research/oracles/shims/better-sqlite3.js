// Minimal better-sqlite3 stand-in backed by node:sqlite (no native build).
import { freshCatalogue, record } from './sqlite-store.js';

export default class Database {
  constructor() {
    this.db = freshCatalogue();
  }

  prepare(sql) {
    const stmt = this.db.prepare(sql);
    return {
      all: (...params) => {
        const rows = stmt.all(...params);
        record(sql, rows);
        return rows;
      },
    };
  }
}

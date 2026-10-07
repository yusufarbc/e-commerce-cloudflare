import { describe, it, expect } from 'vitest';
import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Production schema = D1 migrations; the code queries through the Prisma schema. If the
// two drift, queries fail at runtime ("no such column") while every other check stays
// green, so this test builds a database from the migrations and compares it with the
// Prisma models.
const API = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SCALARS = new Set(['String', 'Int', 'Float', 'Boolean', 'DateTime', 'Json', 'BigInt', 'Decimal', 'Bytes']);

function migratedDatabase() {
    const db = new DatabaseSync(':memory:');
    const dir = path.join(API, 'migrations');
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.sql')).sort()) {
        db.exec(fs.readFileSync(path.join(dir, file), 'utf8'));
    }
    return db;
}

function prismaModels() {
    const text = fs.readFileSync(path.join(API, 'prisma/schema.prisma'), 'utf8');
    const models = [];
    for (const block of text.matchAll(/^model\s+(\w+)\s*\{([\s\S]*?)^\}/gm)) {
        const [, name, body] = block;
        const table = body.match(/@@map\("([^"]+)"\)/)?.[1] ?? name;
        const columns = [];
        for (const line of body.split('\n')) {
            const field = line.trim().match(/^(\w+)\s+(\w+)(\?|\[\])?/);
            if (field && SCALARS.has(field[2]) && field[3] !== '[]') {
                // A field can be stored under another column name via @map("...").
                columns.push(line.match(/@map\("([^"]+)"\)/)?.[1] ?? field[1]);
            }
        }
        models.push({ name, table, columns });
    }
    return models;
}

describe('D1 migrations match the Prisma schema', () => {
    const db = migratedDatabase();
    const tables = new Set(db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map((r) => r.name));

    for (const model of prismaModels()) {
        it(`${model.name} (${model.table})`, () => {
            expect(tables.has(model.table), `table ${model.table} is missing from the migrations`).toBe(true);
            const actual = new Set(db.prepare(`PRAGMA table_info("${model.table}")`).all().map((c) => c.name));
            const missing = model.columns.filter((c) => !actual.has(c));
            expect(missing, `columns missing from ${model.table}`).toEqual([]);
        });
    }
});

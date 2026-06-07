import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const colorsDir = process.env.RENKLER_DIR
  ? path.resolve(process.env.RENKLER_DIR)
  : path.resolve(__dirname, '..', '..', '..', 'renkler');
const files = [
  path.join(colorsDir, 'polisan-ic-cephe-renkler.csv'),
  path.join(colorsDir, 'polisan-dis-cephe-renkler.csv')
];

function parseCsvLine(line) {
  const cells = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];

    if (char === '"') {
      if (inQuotes && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      cells.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  cells.push(current);
  return cells.map((cell) => cell.trim());
}

function parseCsv(content) {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const header = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const record = {};
    header.forEach((key, index) => {
      record[key] = values[index] ?? '';
    });
    return record;
  });
}

async function main() {
  const allRows = [];

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf8');
    const rows = parseCsv(content);
    allRows.push(...rows);
  }

  const normalized = allRows.map((row, index) => ({
    section: row.section,
    code: row.code,
    name: row.name,
    hex: row.hex,
    rgb: row.rgb,
    sourceFile: row.sourceFile || null,
    aktif: true,
    sira: index + 1
  }));

  await prisma.renkKartelasi.deleteMany({});
  await prisma.renkKartelasi.createMany({ data: normalized });

  console.log(`Imported ${normalized.length} colors into RenkKartelasi`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { defineConfig } from 'vitest/config';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Corpus files import bare packages; resolve them from this directory.
const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: [
      { find: /^hono$/, replacement: fileURLToPath(import.meta.resolve('hono')) },
      { find: /^express$/, replacement: require.resolve('express') },
      { find: /^better-sqlite3$/, replacement: path.join(here, 'shims/better-sqlite3.js') },
      { find: /^node-fetch$/, replacement: path.join(here, 'shims/node-fetch.js') },
    ],
  },
  server: { fs: { allow: ['..'] } },
  test: { include: ['tests/**/*.test.js'], environment: 'node' },
});

import { defineConfig } from 'prisma/config';

// Used by the Prisma CLI only (validate, generate, migrate diff). At runtime the Worker
// talks to D1 through the binding, so this URL is never opened by the app.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: 'file:./prisma/dev.db',
  },
});

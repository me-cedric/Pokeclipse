import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  schema: './src/schema.ts',
  dialect: 'postgresql',
  out: './drizzle',
  driver: 'pglite',
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
});

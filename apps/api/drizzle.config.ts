import { defineConfig } from 'drizzle-kit'
import env from './src/utils/env'

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: env.DB_URL as string,
  },
})

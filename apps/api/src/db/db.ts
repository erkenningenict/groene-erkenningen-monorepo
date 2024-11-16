import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '../db/schema'
import env from '../../env'

export const connection = postgres(env.DB_URL, {
  max: env.DB_MIGRATING || env.DB_SEEDING ? 1 : undefined,
  onnotice: env.DB_SEEDING ? () => {} : undefined,
})

export const db = drizzle(connection, {
  schema,
  logger: env.LOG_LEVEL === 'debug',
})

export type db = typeof db

export default db
import { Table, getTableName, sql } from 'drizzle-orm'
import env from '../utils/env'
import { db, connection } from './db'
import * as schema from './schema'
import configSeed from './seeds/config'
import postcodesSeed from './seeds/postcodes'

if (!env.DB_SEEDING) {
  throw new Error('You must set DB_SEEDING to "true" when running seeds')
}

async function resetTable(db: db, table: Table) {
  return db.execute(
    sql.raw(`TRUNCATE TABLE ${getTableName(table)} RESTART IDENTITY CASCADE`),
  )
}

// await db.delete(table); // clear tables without truncating / resetting ids
await resetTable(db, schema.config)
await resetTable(db, schema.postcodes)

await configSeed(db)
await postcodesSeed(db)

await connection.end()

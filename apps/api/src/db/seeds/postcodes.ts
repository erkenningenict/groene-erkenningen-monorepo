import type db from '../db'
import postcodesData from './data/postcodes.json'
import { postcodes } from '../schema'
import { sql } from 'drizzle-orm'

export default async function seed(db: db) {
  await db.insert(postcodes).values(
    postcodesData.map(p => {
      return {
        ...p,
        geoLocation: sql`ST_SetSRID(ST_MakePoint(${p.longitude}, ${p.latitude}), 4326)`,
      }
    }) as any,
  )
}

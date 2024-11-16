import type db from '../db'
import configs from './data/config.json'
import { config } from '../schema'

export default async function seed(db: db) {
  await db.insert(config).values(configs as any)
}

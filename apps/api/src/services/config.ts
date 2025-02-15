import { eq } from 'drizzle-orm'
import { config } from '../db/schema'
import db from '../db/db'

export async function getCalendarHints(label: string) {
  const configs = await db.query.config.findFirst({
    where: eq(config.label, label),
  })
  return configs?.calendarHints
}

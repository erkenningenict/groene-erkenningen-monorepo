import { Elysia, t } from 'elysia'
import db from '../db/db'
import { eq } from 'drizzle-orm'
import { certificatesPerLabel } from '../db/schema'

export const publicRegisterEndpoints = new Elysia({
  prefix: 'publicRegister',
})
  .get('/', 'hello elysia')
  .get('/certificates/:label', async ({ params: { label } }) => {
    return await db
      .select({ certificate: certificatesPerLabel.certificate })
      .from(certificatesPerLabel)
      .where(eq(certificatesPerLabel.label, label.replace('%20', ' ')))
  })

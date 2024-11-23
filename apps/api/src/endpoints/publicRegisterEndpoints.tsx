import { Elysia } from 'elysia'
import db from '../db/db'
import { eq } from 'drizzle-orm'
import { certificatesPerLabel } from '../db/schema'
import { checkCertificate } from '../services/check-certificaat.server'
import type { LabelTypes } from '../services/labelConfiguration'
import { getLabel } from '../utils/utils'
import logger from '../utils/logger'

export const publicRegisterEndpoints = new Elysia({
  prefix: 'publicRegister',
})
  .get('/certificates/:label', async ({ params: { label } }) => {
    const foundLabel = getLabel(label)
    logger.info(
      `Get certificates for label ${label}, foundLabel: ${foundLabel}`,
    )
    return await db
      .select({ certificate: certificatesPerLabel.certificate })
      .from(certificatesPerLabel)
      .where(eq(certificatesPerLabel.label, foundLabel))
  })
  .get(
    '/certificates/:label/:certificate/:search',
    async ({ params: { label, certificate, search } }) => {
      const foundLabel = getLabel(label)
      logger.info(
        `Get students for label ${label}, foundLabel: ${foundLabel}, certificate: ${certificate}, search: ${search}`,
      )
      return await checkCertificate(
        search,
        certificate,
        getLabel(label) as LabelTypes,
      )
    },
  )

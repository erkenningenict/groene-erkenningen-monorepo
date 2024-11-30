import { Elysia } from 'elysia'
import { checkCertificate } from '../services/check-certificaat.server'
import type { LabelTypes } from '../services/labelConfiguration'
import { getLabel } from '../utils/utils'
import logger from '../utils/logger'
import { getCertificatesForLabel } from '../services/certificates'

export const publicRegisterEndpoints = new Elysia({
  prefix: 'publicRegister',
})
  .get('/certificates/:label', async ({ params: { label } }) => {
    const foundLabel = getLabel(label)
    logger.info(
      `Get certificates for label ${label}, foundLabel: ${foundLabel}`,
    )
    try {
      return await getCertificatesForLabel(foundLabel)
    } catch (err) {
      logger.error('Could not get certificates: ', err)
    }
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

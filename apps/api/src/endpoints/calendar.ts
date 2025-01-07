import { Elysia, t } from 'elysia'
import type { LabelTypes } from '../services/labelConfiguration.js'
import { getLabel } from '../utils/utils.js'
import logger from '../utils/logger.js'
import { getCertificatesOfExams } from '../services/certificates.js'
import { getOrganisationOfLabel } from '../services/organisations.js'
import { all, MeetingTypesEnum } from '../services/constants'
import * as v from 'valibot'
import { CalendarStartUpSettingsSchema } from '../services/calendarStartUpSettingsSchema'
import { addDays, format } from 'date-fns'
import { getExamsForLabelAndCriteria } from '../services/exams.js'
import { CalendarSearchSchema } from '../services/query-params-validation.js'
import { APIError } from '../errors/apiError.js'

const getCertificateName = (certificate: string | null) => {
  switch (certificate) {
    case 'AG':
      return `${certificate} - Adviseren Gewasbescherming`
    case 'BG':
      return `${certificate} - Bedrijfsvoeren Gewasbescherming`
    case 'BD':
      return `${certificate} - Bedrijfsvoeren + Distribueren`
    case 'DB':
      return `${certificate} - Distribueren Bestrijdingsmiddelen`
    case 'UG':
      return `${certificate} - Uitvoeren Gewasbescherming`
    case 'ME':
      return `${certificate} - Mollen en Woelratten`
    default:
      return certificate ?? ''
  }
}

export const calendarEndpoints = new Elysia({
  prefix: 'calendar',
})
  .get('/settings/:label', async ({ params: { label } }) => {
    const foundLabel = getLabel(label)
    logger.info(
      `Get calendar certificates for label ${label}, foundLabel: ${foundLabel}`,
    )
    const certificates = await getCertificatesOfExams(foundLabel)
    const organisations = await getOrganisationOfLabel(
      getLabel(label) as LabelTypes,
    )
    const defaultSettings = {
      meetingType: MeetingTypesEnum.Alle,
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(addDays(new Date(), 180), 'yyyy-MM-dd'),
      certificate: all,
      organisation: all,
      locationType: all,
      search: '',
      zipCode: '',
      distance: all,
    }

    const startUpSettings = {
      defaultSettings,
      certificates: certificates
        .filter(c => c.certificate)
        .map(certificate => ({
          label: getCertificateName(certificate.certificate),
          value: certificate.certificate,
        })),
      organisations: organisations.map(({ organisation }) => organisation),
    }
    const parsed = v.safeParse(CalendarStartUpSettingsSchema, startUpSettings)
    console.log('#DH# parsedl', parsed.issues?.[0])

    return parsed.output
  })
  .get(
    '/calendar/:label',
    async ({
      params: { label },
      query: {
        meetingType,
        startDate,
        endDate,
        certificate,
        organisation,
        locationType,
        search,
        zipCode,
        distance,
      },
      error: errorHandler,
    }) => {
      const foundLabel = getLabel(label)
      logger.info(
        `Get calendar certificates for label ${label}, foundLabel: ${foundLabel}, MeetingType ${meetingType}, startDate ${startDate}, endDate ${endDate}, certificate ${certificate}, organisation ${organisation}, locationType ${locationType}, search ${search}, zipCode ${zipCode}, distance ${distance}`,
      )

      const parsed = v.safeParse(CalendarSearchSchema, { zipCode, distance })
      if (parsed.issues) {
        console.log('#DH# parsed', parsed.issues[0])
        throw new Error(parsed.issues[0].message)
      }
      console.log('#DH# paserd output', parsed.output)

      try {
        const exams = await getExamsForLabelAndCriteria({
          label: foundLabel,
          meetingType,
          startDate,
          endDate,
          certificate,
          organisation,
          locationType,
          search,
          zipCode: parsed.output.zipCode,
          distance: parsed.output.distance,
        })
        return exams
      } catch (error) {
        if (error instanceof APIError) {
          return errorHandler(error.httpCode, {
            code: 'ZIP_CODE_NOT_FOUND',
            message: error.message,
          })
        }

        logger.error(error)
        return errorHandler(500, 'Unknown error')
      }
    },
    {
      params: t.Object({
        label: t.String(),
      }),
      query: t.Object({
        meetingType: t.Optional(t.String()),
        startDate: t.Optional(t.String()),
        endDate: t.Optional(t.String()),
        certificate: t.Optional(t.String()),
        organisation: t.Optional(t.String()),
        locationType: t.Optional(t.String()),
        search: t.Optional(t.String()),
        zipCode: t.Optional(t.String()),
        distance: t.Optional(t.String()),
      }),
    },
  )

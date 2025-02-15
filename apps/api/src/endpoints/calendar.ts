import { addDays, format } from 'date-fns'
import { Elysia, t } from 'elysia'
import * as v from 'valibot'
import { APIError } from '../errors/apiError.js'
import { CalendarSearchParamsSchema } from '../schemas/calendarSearchParameterSchema.js'
import { CalendarStartUpSettingsSchema } from '../services/calendarStartUpSettingsSchema'
import { getCertificatesOfExams } from '../services/certificates.js'
import { getCalendarHints } from '../services/config.js'
import { all, MeetingTypesEnum, nrOfDaysToFetch } from '../services/constants'
import { getExamsForLabelAndCriteria } from '../services/exams.js'
import type { LabelTypes } from '../services/labelConfiguration.js'
import { getOrganisationOfLabel } from '../services/organisations.js'
import logger from '../utils/logger.js'
import { getLabel } from '../utils/utils.js'
import { losExamenMoment } from '../services/los-examen-moment.js'
import db from '../db/db.js'
import { eq } from 'drizzle-orm'
import { config as configDb } from '../db/schema.js'
import { SingleExamSchema } from '../schemas/singleExamSchema.js'

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
  .get(
    '/settings/:label',
    async ({ params: { label }, error: errorHandler }) => {
      const foundLabel = getLabel(label)
      logger.info(
        `Get calendar certificates for label ${label}, foundLabel: ${foundLabel}`,
      )
      const certificates = await getCertificatesOfExams(foundLabel)
      const organisations = await getOrganisationOfLabel(
        getLabel(label) as LabelTypes,
      )
      const defaultSettings = {
        meetingType: MeetingTypesEnum['[Alle]'],
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: format(addDays(new Date(), nrOfDaysToFetch), 'yyyy-MM-dd'),
        certificates: [],
        organisation: all,
        locationType: all,
        search: '',
        zipCode: '',
        distance: all,
      }
      const calendarHints = await getCalendarHints(foundLabel)

      const startUpSettings = {
        defaultSettings,
        certificates: certificates
          .filter(c => c.certificate)
          .map(certificate => ({
            label: getCertificateName(certificate.certificate),
            value: certificate.certificate,
          })),
        organisations: organisations.map(({ organisation }) => organisation),
        calendarHints,
      }
      const parsed = v.safeParse(CalendarStartUpSettingsSchema, startUpSettings)
      if (parsed.success) {
        return parsed.output
      } else {
        logger.error('Error get settings', parsed.issues)
        return errorHandler(500, {
          code: 'VALIDATION_ERROR',
          message: parsed.issues[0].message,
        })
      }
    },
  )
  .get(
    '/calendar/:label',
    async ({
      params: { label },
      query: {
        meetingType,
        startDate,
        endDate,
        certificates,
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
        `Get calendar certificates for label ${label}, foundLabel: ${foundLabel}, MeetingType ${meetingType}, startDate ${startDate}, endDate ${endDate}, certificates ${certificates}, organisation ${organisation}, locationType ${locationType}, search ${search}, zipCode ${zipCode}, distance ${distance}`,
      )

      const parsed = v.safeParse(CalendarSearchParamsSchema, {
        meetingType,
        startDate,
        endDate,
        certificates,
        organisation,
        locationType,
        search,
        zipCode,
        distance,
      })
      if (parsed.issues) {
        return errorHandler(400, {
          code: 'VALIDATION_ERROR',
          message: parsed.issues[0].message,
        })
      }

      try {
        const exams = await getExamsForLabelAndCriteria({
          label: foundLabel,
          meetingType: parsed.output.meetingType,
          startDate: parsed.output.startDate,
          endDate: parsed.output.endDate,
          certificates: parsed.output.certificates,
          organisation: parsed.output.organisation,
          locationType: parsed.output.locationType,
          search: parsed.output.search,
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
        certificates: t.Optional(t.Union([t.String(), t.Array(t.String())])),
        organisation: t.Optional(t.String()),
        locationType: t.Optional(t.String()),
        search: t.Optional(t.String()),
        zipCode: t.Optional(t.String()),
        distance: t.Optional(t.String()),
      }),
    },
  )
  .get(
    '/examenTypeNummer/:examenTypeNummer/examenNummer/:examenNummer/label/:label',
    async ({
      params: { label, examenTypeNummer, examenNummer },
      error: errorHandler,
    }) => {
      const foundLabel = getLabel(label)
      logger.info(
        `Get single exam for label ${label}, foundLabel: ${foundLabel}`,
      )
      const config = await db.query.config.findFirst({
        where: eq(configDb.label, foundLabel),
      })
      if (!config) {
        return errorHandler(400, {
          code: 'VALIDATION_ERROR',
          message: 'Label niet gevonden',
        })
      }
      try {
        const exam = await losExamenMoment({
          config,
          examenTypeNummer,
          examenNummer,
        })

        const parsed = v.safeParse(SingleExamSchema, exam)
        if (parsed.success) {
          return parsed.output
        } else {
          logger.error('Error get single exam', parsed.issues)
          return errorHandler(500, {
            code: 'VALIDATION_ERROR',
            message: parsed.issues[0].message,
          })
        }
      } catch (err: unknown) {
        if (hasMessageProperty(err)) {
          return errorHandler(500, {
            code: 'GENERIC_ERROR',
            message: err.message,
          })
        } else {
          return errorHandler(500, {
            code: 'GENERIC_ERROR',
            message: err,
          })
        }
      }
    },
    {
      params: t.Object({
        label: t.String(),
        examenTypeNummer: t.Number(),
        examenNummer: t.Number(),
      }),
    },
  )
export type ErrorResponse = { message: string }

export function hasMessageProperty(error: unknown): error is ErrorResponse {
  return typeof error === 'object' && error !== null && 'message' in error
}

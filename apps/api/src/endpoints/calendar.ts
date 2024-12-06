import { Elysia, t } from 'elysia'
import type { LabelTypes } from '../services/labelConfiguration.js'
import { getLabel } from '../utils/utils.js'
import logger from '../utils/logger.js'
import { getCertificatesOfExams } from '../services/certificates.js'
import { getOrganisationOfLabel } from '../services/organisations.js'
import { all, MeetingTypesEnum } from '@repo/constants'
import * as v from 'valibot'
import { CalendarStartUpSettingsSchema } from '@repo/schemas'
import { addDays, format } from 'date-fns'
import { getExamsForLabelAndCriteria } from '../services/exams.js'

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
      },
    }) => {
      const foundLabel = getLabel(label)
      logger.info(
        `Get calendar certificates for label ${label}, foundLabel: ${foundLabel}, MeetingType ${meetingType}, startDate ${startDate}, endDate ${endDate}, certificate ${certificate}, organisation ${organisation}, locationType ${locationType}, search ${search}`,
      )
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
        })
        return exams
      } catch (error) {
        console.log('#DH# error', error)
        logger.error(error)
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
      }),
    },
  )

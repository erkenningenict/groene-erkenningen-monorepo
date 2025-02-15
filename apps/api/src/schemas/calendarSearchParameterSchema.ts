import * as v from 'valibot'
import {
  all,
  LocationTypesEnum,
  MeetingTypesEnum,
  nrOfDaysToFetch,
} from '../services/constants'
import { addDays, endOfDay, isDate, parse, startOfDay } from 'date-fns'

const TransformInputToStringSchema = v.pipe(
  v.nullable(v.string()),
  v.transform(value => (value === 'null' ? '' : value?.trim() || '')),
)
const StringOrNullToAllSchema = v.pipe(
  v.nullable(v.string()),
  v.transform(value => (value === 'null' ? all : value?.trim() || '')),
)

export const CertificatesSchema = v.pipe(
  v.union([v.string(), v.array(v.string()), v.literal('')]),
  v.transform((value: any) => {
    if (Array.isArray(value)) {
      return value
    }
    if (value === '') {
      return []
    }
    return value.split(',').map((item: string) => item.trim())
  }),
)

export const CalendarSearchParamsSchema = v.pipe(
  v.object({
    meetingType: v.pipe(StringOrNullToAllSchema, v.enum(MeetingTypesEnum)),
    startDate: v.pipe(
      TransformInputToStringSchema,
      v.transform((input: string) => {
        if (input === '') {
          return startOfDay(new Date())
        } else {
          const date = startOfDay(new Date(input))
          if (date >= startOfDay(new Date())) {
            return startOfDay(new Date())
          }
          return date
        }
      }),
      v.date(),
    ),
    endDate: v.pipe(
      TransformInputToStringSchema,
      v.transform((input: string) => {
        if (input === '') {
          return endOfDay(addDays(new Date(), nrOfDaysToFetch))
        } else {
          return endOfDay(new Date(input))
        }
      }),
      v.date(),
    ),
    certificates: CertificatesSchema,
    organisation: StringOrNullToAllSchema,
    locationType: v.pipe(StringOrNullToAllSchema, v.enum(LocationTypesEnum)),
    search: TransformInputToStringSchema,
    zipCode: v.pipe(
      TransformInputToStringSchema,
      v.transform((input: string) => {
        if (input === '') {
          return 0
        }
        const match = input.match(/^[1-9]\d{3}/)
        const res = match ? parseInt(`${match.at(0)}`, 10) : 0
        return res
      }),
    ),
    distance: v.pipe(
      TransformInputToStringSchema,
      v.transform(value => (value === '' || value === all ? 0 : Number(value))),
    ),
  }),
  v.check(input => {
    if (input.startDate > input.endDate) {
      return false
    }
    return true
  }, 'Startdatum moet voor einddatum liggen'),
)

export type CalendarSearchParams = v.InferOutput<
  typeof CalendarSearchParamsSchema
>

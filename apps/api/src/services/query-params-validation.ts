import * as v from 'valibot'

const StringOrNullSchema = v.pipe(
  v.nullable(v.string()),
  v.transform(value => (value === 'null' ? '' : value?.trim() || '')),
)

export const CalendarSearchSchema = v.object({
  zipCode: StringOrNullSchema,
  distance: v.pipe(
    StringOrNullSchema,
    v.transform(value => (value === '' ? 0 : Number(value))),
  ),
})

export type CalendarSearch = v.InferOutput<typeof CalendarSearchSchema>

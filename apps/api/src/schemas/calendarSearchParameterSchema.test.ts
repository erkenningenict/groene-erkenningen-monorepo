// import { describe, expect, it } from 'bun:test'
import { describe, expect, it } from 'vitest'
import {
  CalendarSearchParamsSchema,
  CertificatesSchema,
} from './calendarSearchParameterSchema'
import * as v from 'valibot'
import { all, nrOfDaysToFetch } from '../services/constants'
import { addDays, endOfDay, format, startOfDay } from 'date-fns'

describe('CalendarSearchParamsSchema', () => {
  it('should return empty array for certificate empty string value', () => {
    const input = ''
    const x = v.safeParse(CertificatesSchema, input)
    if (x.success) {
      expect(x.output).toEqual([])
    } else {
      console.log(x.output)
      throw new Error('not success')
    }
  })

  it('should return one item for single value', () => {
    const input = 'AG'
    const x = v.safeParse(CertificatesSchema, input)
    if (x.success) {
      expect(x.output).toEqual(['AG'])
    } else {
      console.log(x.output)
      throw new Error('not success')
    }
  })

  it('should return array for two comma separated values', () => {
    const input = 'AG,BG'
    const x = v.safeParse(CertificatesSchema, input)
    if (x.success) {
      expect(x.output).toEqual(['AG', 'BG'])
    } else {
      console.log(x.output)
      throw new Error('not success')
    }
  })

  it('should return empty array for certificate empty string value', () => {
    const input: string[] = []
    const x = v.safeParse(CertificatesSchema, input)
    if (x.success) {
      expect(x.output).toEqual([])
    } else {
      console.log(x.output)
      throw new Error('not success')
    }
  })

  it('should return defaults for null string values', () => {
    const input = {
      meetingType: 'null',
      startDate: 'null',
      endDate: 'null',
      certificates: '',
      organisation: 'null',
      locationType: 'null',
      search: 'null',
      zipCode: 'null',
      distance: 'null',
    }
    const x = v.safeParse(CalendarSearchParamsSchema, input)
    if (x.success) {
      expect(x.output.meetingType).toEqual(all)
      expect(x.output.startDate).toEqual(startOfDay(new Date()))
      expect(x.output.endDate).toEqual(endOfDay(addDays(new Date(), 180)))
      expect(x.output.certificates).toEqual([])
      expect(x.output.organisation).toEqual(all)
      expect(x.output.locationType).toEqual(all)
      expect(x.output.search).toEqual('')
      expect(x.output.zipCode).toEqual(0)
      expect(x.output.distance).toEqual(0)
    } else {
      throw new Error('not success')
    }
  })

  it('should return for default values', () => {
    const input = {
      meetingType: all,
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(addDays(new Date(), nrOfDaysToFetch), 'yyyy-MM-dd'),
      certificates: 'AG,BG,BD,UG',
      organisation: all,
      locationType: all,
      search: '',
      zipCode: '',
      distance: all,
    }
    const x = v.safeParse(CalendarSearchParamsSchema, input)
    if (x.success) {
      expect(x.output.meetingType).toEqual(all)
      expect(x.output.startDate).toEqual(startOfDay(new Date(input.startDate)))
      expect(x.output.endDate).toEqual(endOfDay(new Date(input.endDate)))
      expect(x.output.certificates).toEqual(['AG', 'BG', 'BD', 'UG'])
      expect(x.output.organisation).toEqual(all)
      expect(x.output.locationType).toEqual(all)
      expect(x.output.search).toEqual('')
      expect(x.output.zipCode).toEqual(0)
      expect(x.output.distance).toEqual(0)
    } else {
      throw new Error('not success')
    }
  })

  it('should return start of today when date is in the past', () => {
    // Use a dynamic future date (1 year from now) to ensure the test keeps working
    const futureEndDate = format(addDays(new Date(), 365), 'yyyy-MM-dd')

    const input = {
      meetingType: all,
      startDate: '2020-01-01',
      endDate: futureEndDate,
      certificates: '',
      organisation: all,
      locationType: all,
      search: '',
      zipCode: '',
      distance: all,
    }
    const x = v.safeParse(CalendarSearchParamsSchema, input)
    if (x.success) {
      expect(x.output.meetingType).toEqual(all)
      expect(x.output.startDate).toEqual(startOfDay(new Date()))
      expect(x.output.endDate).toEqual(endOfDay(new Date(input.endDate)))
      expect(x.output.certificates).toEqual([])
      expect(x.output.organisation).toEqual(all)
      expect(x.output.locationType).toEqual(all)
      expect(x.output.search).toEqual('')
      expect(x.output.zipCode).toEqual(0)
      expect(x.output.distance).toEqual(0)
    } else {
      throw new Error('not success')
    }
  })

  it('should return error when end date is before start date', () => {
    const input = {
      meetingType: all,
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(addDays(new Date(), -1), 'yyyy-MM-dd'),
      certificates: all,
      organisation: all,
      locationType: all,
      search: '',
      zipCode: '',
      distance: all,
    }
    const x = v.safeParse(CalendarSearchParamsSchema, input)
    if (x.success) {
      throw new Error('success')
    }
    const issue = v.flatten<typeof CalendarSearchParamsSchema>(x.issues)
    expect(issue.root?.at(0)).toEqual('Startdatum moet voor einddatum liggen')
  })

  it('should return error for invalid data type meeting', () => {
    const input = {
      meetingType: 'SOME_UNEXPECTED_VALUE',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(addDays(new Date(), nrOfDaysToFetch), 'yyyy-MM-dd'),
      certificates: [],
      organisation: all,
      locationType: all,
      search: '',
      zipCode: '',
      distance: all,
    }
    const x = v.safeParse(CalendarSearchParamsSchema, input)
    if (x.success) {
      throw new Error('success')
    }
    const issue = v.flatten<typeof CalendarSearchParamsSchema>(x.issues)
    expect(issue.nested?.meetingType).toEqual([
      'Invalid type: Expected ("[Alle]" | "Kennisbijeenkomst" | "Examen") but received "SOME_UNEXPECTED_VALUE"',
    ])
  })

  it('should return error for invalid data type meeting', () => {
    const input = {
      meetingType: all,
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(addDays(new Date(), nrOfDaysToFetch), 'yyyy-MM-dd'),
      certificates: [],
      organisation: all,
      locationType: 'SOME_UNEXPECTED_LOCATION_TYPE',
      search: '',
      zipCode: '',
      distance: all,
    }
    const x = v.safeParse(CalendarSearchParamsSchema, input)
    if (x.success) {
      throw new Error('success')
    }
    const issue = v.flatten<typeof CalendarSearchParamsSchema>(x.issues)
    expect(issue.nested?.locationType).toEqual([
      'Invalid type: Expected ("[Alle]" | "Fysieke locatie" | "Webinar") but received "SOME_UNEXPECTED_LOCATION_TYPE"',
    ])
  })

  it('should return succes for valid zip code', () => {
    const input = {
      meetingType: all,
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(addDays(new Date(), nrOfDaysToFetch), 'yyyy-MM-dd'),
      certificates: [],
      organisation: all,
      locationType: all,
      search: '',
      zipCode: '3825',
      distance: all,
    }
    const x = v.safeParse(CalendarSearchParamsSchema, input)
    if (x.success) {
      expect(x.output.meetingType).toEqual(all)
      expect(x.output.startDate).toEqual(startOfDay(new Date(input.startDate)))
      expect(x.output.endDate).toEqual(endOfDay(new Date(input.endDate)))
      expect(x.output.certificates).toEqual([])
      expect(x.output.organisation).toEqual(all)
      expect(x.output.locationType).toEqual(all)
      expect(x.output.search).toEqual('')
      expect(x.output.zipCode).toEqual(3825)
      expect(x.output.distance).toEqual(0)
    }
  })

  it('should return succes for valid zip code', () => {
    const input = {
      meetingType: all,
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(addDays(new Date(), nrOfDaysToFetch), 'yyyy-MM-dd'),
      certificates: [],
      organisation: all,
      locationType: all,
      search: '',
      zipCode: '385',
      distance: all,
    }
    const x = v.safeParse(CalendarSearchParamsSchema, input)
    if (x.success) {
      expect(x.output.meetingType).toEqual(all)
      expect(x.output.startDate).toEqual(startOfDay(new Date(input.startDate)))
      expect(x.output.endDate).toEqual(endOfDay(new Date(input.endDate)))
      expect(x.output.certificates).toEqual([])
      expect(x.output.organisation).toEqual(all)
      expect(x.output.locationType).toEqual(all)
      expect(x.output.search).toEqual('')
      expect(x.output.zipCode).toEqual(0)
      expect(x.output.distance).toEqual(0)
    } else {
      const issue = v.flatten<typeof CalendarSearchParamsSchema>(x.issues)
      expect(issue.root?.[0]).toEqual('')
    }
  })
})

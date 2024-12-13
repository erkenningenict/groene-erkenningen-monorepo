import {
  and,
  eq,
  getTableColumns,
  gte,
  ilike,
  lte,
  ne,
  or,
  sql,
} from 'drizzle-orm'
import db from '../db/db'

import { examenMomenten } from '../db/schema'
import { addDays, endOfDay, startOfDay } from 'date-fns'

export async function getExamsForLabelAndCriteria(inputData: {
  label: string
  meetingType: string | undefined
  startDate: string | undefined
  endDate: string | undefined
  certificate: string | undefined
  organisation: string | undefined
  locationType: string | undefined
  search: string | undefined
  // queryDistance: number,
  // showDistance,
  // geoLocation,
  // inputData,
}) {
  const all = '[Alle]'
  const showDistance = false
  const geoLocation = { x: 0, y: 0 }
  console.log(
    '#DH#  (inputData.locationType ?? all)',
    inputData.locationType === 'null' || all,
  )

  const getValue = (value: string | undefined) => {
    if (value === all) {
      return all
    }
    return value === 'null' || !value ? all : value
  }

  const examMoments = await db
    .select({
      ...getTableColumns(examenMomenten),
      // distance: (showDistance && geoLocation?.x
      //   ? (sql`ST_Distance(ST_SetSRID(geo_location, 4326),
      // ST_SetSRID(ST_MakePoint(${geoLocation.x}, ${geoLocation.y}), 4326), true)/1000 as afstandInKm` as number)
      //   : 0) as number,
    })
    .from(examenMomenten)
    .where(
      and(
        eq(examenMomenten.label, inputData.label),
        ne(examenMomenten.typeLocatie, 'Online'),
        // queryDistance && inputData.data?.distance !== 0
        //   ? sql`ST_DWithin(
        // geo_location, ST_SetSRID(ST_MakePoint(${geoLocation!.x}, ${geoLocation!.y}), 4326), ${(inputData.data?.distance ?? 0) * 1000},false)`
        //   : undefined,
        gte(
          examenMomenten.examenDatum,
          startOfDay(
            new Date(
              inputData.startDate === 'null' || inputData.startDate === ''
                ? new Date()
                : (inputData.startDate ?? new Date()),
            ),
          ),
        ),
        lte(
          examenMomenten.examenDatum,
          endOfDay(
            new Date(
              inputData.endDate === 'null' || inputData.endDate === ''
                ? addDays(new Date(), 180)
                : (inputData.endDate ?? new Date()),
            ),
          ),
        ),
        getValue(inputData.locationType) !== all
          ? eq(examenMomenten.typeLocatie, getValue(inputData.locationType))
          : undefined,
        getValue(inputData.meetingType) !== all
          ? eq(examenMomenten.typeBijeenkomst, getValue(inputData.meetingType))
          : undefined,
        getValue(inputData.certificate) !== all
          ? eq(examenMomenten.certificaatType, getValue(inputData.certificate))
          : undefined,
        getValue(inputData.organisation) !== all
          ? eq(
              examenMomenten.organisatorBedrijfsnaam,
              getValue(inputData.organisation),
            )
          : undefined,
        inputData.search !== '' && inputData.search !== 'null'
          ? or(
              ilike(
                examenMomenten.examenTypeOmschrijving,
                `%${inputData.search}%`,
              ),
              ilike(examenMomenten.locatieNaam, `%${inputData.search}%`),
              ilike(examenMomenten.locatiePlaats, `%${inputData.search}%`),
            )
          : undefined,
      ),
    )
  return examMoments
}

export type Exam = Awaited<
  ReturnType<typeof getExamsForLabelAndCriteria>
>[0] & { distance: number }

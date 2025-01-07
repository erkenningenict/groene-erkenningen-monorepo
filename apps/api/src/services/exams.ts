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

import { examenMomenten, postcodes } from '../db/schema'
import { addDays, endOfDay, startOfDay } from 'date-fns'
import { APIError } from '../errors/apiError'

export async function getExamsForLabelAndCriteria(inputData: {
  label: string
  meetingType: string | undefined
  startDate: string | undefined
  endDate: string | undefined
  certificate: string | undefined
  organisation: string | undefined
  locationType: string | undefined
  search: string | undefined
  zipCode: string
  distance: number
  // showDistance,
  // geoLocation,
  // inputData,
}) {
  const all = '[Alle]'
  const getValue = (value: string | undefined) => {
    if (value === all) {
      return all
    }
    return value === 'null' || !value ? all : value
  }

  const showDistance = inputData.zipCode !== '' && inputData.distance !== 0
  console.log('#DH# showDistance', showDistance)

  let geoLocation: { x: number; y: number } | null | undefined = { x: 0, y: 0 }
  console.log('#DH# distance', inputData.distance)

  const inputPostcode = +(inputData.zipCode ?? 0)
  const postcode = await db
    .select({ geoLocation: postcodes.geoLocation })
    .from(postcodes)
    .where(eq(postcodes.postcode, inputPostcode))

  // TODO Fix when location is not found, ie zipcode: 3725 is wrong, results in error.

  if (postcode.length === 0) {
    console.log('#DH# not found')
    throw new APIError(400, 'Zip code not found')
  }

  geoLocation = postcode.at(0)?.geoLocation

  const examMoments = await db
    .select({
      ...getTableColumns(examenMomenten),
      distance:
        showDistance && geoLocation?.x
          ? sql`ST_Distance(ST_SetSRID(geo_location, 4326),
      ST_SetSRID(ST_MakePoint(${geoLocation.x}, ${geoLocation.y}), 4326), true)/1000`.as(
              'afstandInKm',
            )
          : sql`0`.as('afstandInKm'),
    })
    .from(examenMomenten)
    .where(
      and(
        eq(examenMomenten.label, inputData.label),
        ne(examenMomenten.typeLocatie, 'Online'),
        showDistance
          ? sql`ST_DWithin(
        geo_location, ST_SetSRID(ST_MakePoint(${geoLocation!.x}, ${geoLocation!.y}), 4326), ${(inputData.distance ?? 0) * 1000},false)`
          : undefined,
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

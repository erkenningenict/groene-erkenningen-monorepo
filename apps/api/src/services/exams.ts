import {
  and,
  eq,
  getTableColumns,
  gte,
  ilike,
  lte,
  ne,
  or,
  inArray,
  sql,
} from 'drizzle-orm'
import db from '../db/db'

import { examenMomenten, postcodes } from '../db/schema'
import { APIError } from '../errors/apiError'
import { all } from './constants'

async function getZipCodeGeoLocation(zipCode: number) {
  let geoLocation: { x: number; y: number } = { x: 0, y: 0 }

  if (!zipCode) {
    return geoLocation
  }

  const inputPostcode = +(zipCode ?? 0)
  const postcode = await db
    .select({ geoLocation: postcodes.geoLocation })
    .from(postcodes)
    .where(eq(postcodes.postcode, inputPostcode))

  if (postcode.length === 0) {
    throw new APIError(400, 'Zip code not found')
  }

  geoLocation = postcode.at(0)?.geoLocation ?? { x: 0, y: 0 }
  return geoLocation
}

export async function getExamsForLabelAndCriteria(inputData: {
  label: string
  meetingType: string
  startDate: Date
  endDate: Date
  certificates: string[]
  organisation: string
  locationType: string
  search: string
  zipCode: number
  distance: number
}) {
  const showDistance = inputData.zipCode !== 0

  const geoLocation = await getZipCodeGeoLocation(inputData.zipCode)

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
        inputData.meetingType === all
          ? undefined
          : eq(examenMomenten.typeBijeenkomst, inputData.meetingType),
        ne(examenMomenten.typeLocatie, 'Online'),
        !showDistance || (showDistance && inputData.distance === 0)
          ? undefined
          : sql`ST_DWithin(
        geo_location, ST_SetSRID(ST_MakePoint(${geoLocation!.x}, ${geoLocation!.y}), 4326), ${(inputData.distance ?? 0) * 1000},false)`,
        gte(examenMomenten.examenDatum, inputData.startDate),
        lte(examenMomenten.examenDatum, inputData.endDate),
        inputData.locationType === all
          ? undefined
          : eq(examenMomenten.typeLocatie, inputData.locationType),
        inputData.certificates.length === 0
          ? undefined
          : inArray(examenMomenten.certificaatType, inputData.certificates),
        inputData.organisation === all
          ? undefined
          : eq(examenMomenten.organisatorBedrijfsnaam, inputData.organisation),

        inputData.search === ''
          ? undefined
          : or(
              ilike(
                examenMomenten.examenTypeOmschrijving,
                `%${inputData.search}%`,
              ),
              ilike(examenMomenten.locatieNaam, `%${inputData.search}%`),
              ilike(examenMomenten.locatiePlaats, `%${inputData.search}%`),
            ),
      ),
    )
  return examMoments
}

export type Exam = Awaited<
  ReturnType<typeof getExamsForLabelAndCriteria>
>[0] & { distance: number }

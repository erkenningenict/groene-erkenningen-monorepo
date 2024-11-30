import { and, eq, getTableColumns, gte, ilike, lte, or, sql } from 'drizzle-orm'
import db from '../db/db'

import { examenMomenten } from '../db/schema'
import { endOfDay, startOfDay } from 'date-fns'

import { CalendarSearchSchema } from '@repo/schemas'

export async function getExamsForLabelAndCriteria({
  inputData: {
    // label: string,
    // queryDistance: number,
    // showDistance,
    // geoLocation,
    // inputData,
  },
}) {
  const all = '[Alle]'
  // const examMoments = await db
  //   .select({
  //     ...getTableColumns(examenMomenten),
  //     distance:
  //       showDistance && geoLocation?.x
  //         ? sql`ST_Distance(ST_SetSRID(geo_location, 4326),
  //   ST_SetSRID(ST_MakePoint(${geoLocation.x}, ${geoLocation.y}), 4326), true)/1000 as afstandInKm`
  //         : (0 as any),
  //   })
  //   .from(examenMomenten)
  //   .where(
  //     and(
  //       eq(examenMomenten.label, label),
  //       // ne(examenMomenten.typeLocatie, "Online"),
  //       queryDistance && inputData.data?.distance !== 0
  //         ? sql`ST_DWithin(
  //       geo_location, ST_SetSRID(ST_MakePoint(${geoLocation!.x}, ${geoLocation!.y}), 4326), ${(inputData.data?.distance ?? 0) * 1000},false)`
  //         : undefined,
  //       gte(examenMomenten.examenDatum, startOfDay(begindatumDate)),
  //       lte(examenMomenten.examenDatum, endOfDay(einddatumDate)),
  //       inputData.data?.locatieType !== all
  //         ? eq(examenMomenten.typeLocatie, inputData.data?.locatieType ?? all)
  //         : undefined,
  //       inputData?.data?.typeBijeenkomst &&
  //         inputData.data?.typeBijeenkomst !== all
  //         ? eq(
  //             examenMomenten.typeBijeenkomst,
  //             inputData.data?.typeBijeenkomst || all,
  //           )
  //         : undefined,
  //       inputData?.data?.certificaatType &&
  //         inputData.data?.certificaatType !== all
  //         ? eq(
  //             examenMomenten.certificaatType,
  //             inputData.data?.certificaatType || all,
  //           )
  //         : undefined,
  //       inputData?.data?.kennisaanbieder &&
  //         inputData.data?.kennisaanbieder !== all
  //         ? eq(
  //             examenMomenten.organisatorBedrijfsnaam,
  //             inputData.data?.kennisaanbieder || all,
  //           )
  //         : undefined,
  //       inputData.data?.search !== ''
  //         ? or(
  //             ilike(
  //               examenMomenten.examenTypeOmschrijving,
  //               `%${inputData.data?.search}%`,
  //             ),
  //             ilike(examenMomenten.locatieNaam, `%${inputData.data?.search}%`),
  //             ilike(
  //               examenMomenten.locatiePlaats,
  //               `%${inputData.data?.search}%`,
  //             ),
  //           )
  //         : undefined,
  //     ),
  //   )
  // return examMoments
}

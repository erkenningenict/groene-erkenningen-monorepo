// Fetch configs

import { addDays, set, startOfDay } from 'date-fns'
import { db } from '../db/db'
import {
  config,
  examenMomenten,
  type InsertExamenMoment,
  type SelectConfig,
} from '../db/schema'
import {
  alleExamenMomenten,
  type AlleExamenMomentenItem,
  type TypeBijeenkomst,
} from './examenMomenten'
import { and, eq, sql } from 'drizzle-orm'
import logger from '../utils/logger'
import env from '../utils/env'
import { sendSlackErrorMessage } from '../utils/slack'

export async function examenMomentenProcessor() {
  const configs = await db.query.config.findMany({
    where: eq(config.enabled, true),
  })
  logger.info(`Start: Processing for all labels`)
  logger.info(`SOAP endpoint: ${env.SOAP_URL_EXAMEN_MOMENTEN}`)
  for (const config of configs) {
    logger.info(
      `Start: Fetch and insert examen momenten for label ${config.label}`,
    )

    await fetchAndInsertExamenMomenten(config, 'Examen')
    await fetchAndInsertExamenMomenten(config, 'Kennisbijeenkomst')
    logger.info(`Done: processing data for label: ${config.label}`)
  }

  logger.info(`Done: Processing for all labels`)

  logger.info(`Start: Setting geo location for non webinar locations`)
  await setGeoLocation()
  logger.info(`Done: Setting geo locations`)
  logger.info(`Done: processing`)
}

export async function setGeoLocation() {
  const statement = sql.raw(`update "examenMomenten" e
set geo_location = p.geo_location
from postcodes p
where cast(left(e.locatie_postcode, 4) as integer) = p.postcode
  and e.type_locatie != 'Webinar'
  and e.type_locatie != 'Online'
  and (left(locatie_postcode, 4) ~ '^[1-9][0-9]{3}$')`)
  await db.execute(statement)
}

export async function fetchAndInsertExamenMomenten(
  config: SelectConfig,
  typeBijeenkomst: TypeBijeenkomst,
) {
  const startDate = startOfDay(new Date()).toISOString()

  const endDate = addDays(new Date(), env.NO_OF_DAYS_TO_FETCH).toISOString()
  let examenMomentenFromApi: AlleExamenMomentenItem[] | undefined = []
  try {
    examenMomentenFromApi = await alleExamenMomenten(
      config,
      typeBijeenkomst,
      startDate,
      endDate,
    )
    if (!examenMomentenFromApi) {
      throw new Error('Examen momenten returned undefined')
    }
  } catch (error) {
    logger.error(
      `Error fetching examen momenten for label ${config.label} and typeBijeenkomst ${typeBijeenkomst}`,
      error,
    )
    await sendSlackErrorMessage({
      channel: 'aocraadtech',
      message: `Error fetching examen momenten for label ${config.label} and typeBijeenkomst ${typeBijeenkomst}`,
      error,
    })
    return
  }

  await db
    .delete(examenMomenten)
    .where(
      and(
        eq(examenMomenten.label, config.label),
        eq(examenMomenten.typeBijeenkomst, typeBijeenkomst),
      ),
    )
  logger.info(
    `Deleted all examen momenten for label ${config.label} and TypeBijeenkomst ${typeBijeenkomst}`,
  )

  if (!examenMomentenFromApi) {
    logger.info(
      `No data form label ${config.label} and typeBijeenkomst ${typeBijeenkomst}`,
    )
    return
  }

  logger.info(
    `Data from api for label ${config.label} and TypeBijeenkomst: ${typeBijeenkomst}. Inserting ${examenMomentenFromApi.length} items`,
  )
  const examensToInsert = examenMomentenMapper(
    config,
    examenMomentenFromApi,
    typeBijeenkomst,
  )
  if (!examensToInsert || examensToInsert.length === 0) {
    return
  }
  await db.insert(examenMomenten).values(examensToInsert)
}

export function examenMomentenMapper(
  config: SelectConfig,
  examenMomentenFromApi: AlleExamenMomentenItem[] | undefined,
  typeBijeenkomst: TypeBijeenkomst,
) {
  return examenMomentenFromApi?.map(row => {
    const certificateTypeInfo = setCertificateType(
      row,
      config.certificateTypeConfiguration as CertificateTypeConfiguration | null,
    )

    return {
      label: config.label,
      typeBijeenkomst: typeBijeenkomst,
      examenNummer: row.examenNummer,
      examenTypeNummer: row.examenTypeNummer,
      examenTypeOmschrijving: row.examenTypeOmschrijving,
      examenDatum: row.examenDatum,
      typeExamen: certificateTypeInfo.typeExamen,
      typeLocatie: getLocatieType(row.locatieNaam),
      locatieNaam: row.locatieNaam,
      locatiePostcode: row.locatiePostcode,
      locatiePlaats: row.locatiePlaats,
      organisatorBedrijfsnaam: row.organisatorBedrijfsnaam,
      url: row.url,
      prijs: row.prijs || 0,
      certificaatType: certificateTypeInfo?.certificaatType,
    } satisfies Omit<InsertExamenMoment, 'id' | 'createdAt'>
  })
}

export type CertificateTypeConfiguration = {
  certificateMatcher: string
}

export function setCertificateType(
  row: AlleExamenMomentenItem,
  config: CertificateTypeConfiguration | null,
): Pick<InsertExamenMoment, 'typeExamen' | 'certificaatType'> {
  const emptyResult = {
    typeExamen: row.typeExamen,
    certificaatType: undefined,
  }
  if (!config || config === null) {
    return emptyResult
  }

  if (config.certificateMatcher === 'ALL') {
    return {
      typeExamen: row.typeExamen,
      certificaatType: row.typeExamen,
    }
  }
  const regex = new RegExp(config.certificateMatcher)
  const res = row.typeExamen.match(regex)
  if (!res) {
    return emptyResult
  }
  return {
    typeExamen: row.typeExamen.replace(regex, '').trim(),
    certificaatType: res.at(1),
  }
}

export function getLocatieType(
  locatie: string,
): 'Online' | 'Fysieke locatie' | 'Webinar' {
  if (locatie.toLowerCase().includes('online')) {
    return 'Online'
  }
  if (locatie.toLowerCase().includes('webinar')) {
    return 'Webinar'
  }
  return 'Fysieke locatie'
}

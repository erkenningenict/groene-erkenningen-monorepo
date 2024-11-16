import { parseString, processors } from 'xml2js'
import { toDutchDateTime } from '../utils/dateTimeUtils'
import {
  getExamenMomentenDateArrayResult,
  getMockFile,
  getNewNumberArrayResult,
  getNewStringArrayResult,
  getSoapBody,
  logAndThrowError,
} from '../utils/utils'
import type { LabelTypes } from './labelConfiguration'
import logger from '../utils/logger'
import type { SelectConfig } from '../db/schema'
import env from '../../env'

export type TypeBijeenkomst = 'Examen' | 'Kennisbijeenkomst'

export async function alleExamenMomenten(
  config: SelectConfig,
  typeBijeenkomst: TypeBijeenkomst,
  begindatum?: string,
  einddatum?: string,
): Promise<AlleExamenMomentenItem[] | undefined> {
  const username = env.EXAMEN_SERVICES_API_USERNAME
  const password = env.PASSWORD_EXAMEN_MOMENTEN
  const soapUrl = env.SOAP_URL_EXAMEN_MOMENTEN
  const typeCertificaat = config.label
  const organisationCode = config.organisationCode

  const soapRequestBody = `<soap:APIAlleExamenmomenten><soap:Einddatum>${einddatum}</soap:Einddatum><soap:Begindatum>${begindatum}</soap:Begindatum><soap:OrganisatieCode>${organisationCode}</soap:OrganisatieCode><soap:TypeCertificaat>${typeCertificaat}</soap:TypeCertificaat><soap:TypeBijeenkomst>${typeBijeenkomst}</soap:TypeBijeenkomst></soap:APIAlleExamenmomenten>`
  logger.debug(`Soap request body alle examen momenten:\n${soapRequestBody}`)

  if (process.env.E2E === 'true') {
    const xml = await getMockFile('./mocks/alle-examen-momenten-new.xml')
    return alleExamenMomentenToJs(
      xml,
      config.label,
      begindatum,
      einddatum,
      typeBijeenkomst,
    )
  }

  const body = await getSoapBody(
    soapUrl,
    'http://www.triggre.com/2018/soap/Service/APIAlleExamenmomenten',
    username,
    password,
    soapRequestBody,
    `label: ${config.label}, type bijeenkomst: ${typeBijeenkomst}`,
  )

  return alleExamenMomentenToJs(
    body,
    config.label,
    begindatum,
    einddatum,
    typeBijeenkomst,
  )
}

export function alleExamenMomentenToJs(
  xml: string,
  label: string,
  begindatum?: string,
  einddatum?: string,
  typeBijeenkomst = 'Alle',
): AlleExamenMomentenItem[] {
  const options = {
    tagNameProcessors: [processors.stripPrefix],
    explicitArray: false,
  }

  let examenMomenten: AlleExamenMomentenItem[] = []
  parseString(xml, options, (err: any, result: any) => {
    if (err) {
      logAndThrowError(
        `Error parse string at alleExamenMomentenToJs for label: ${label}, begindatum: ${begindatum}, einddatum: ${einddatum}, typeBijeenkomst: ${typeBijeenkomst}. Error: ${err}`,
        err,
      )
    }

    const response = result.Envelope.Body
      .APIAlleExamenmomentenResponse as IAPIAlleExamenmomentenOutput
    logger.debug(
      `Response: ${response.Status}, aantal resultaten: ${response.AantalResultaten}`,
    )

    if (response.Status !== 'OK') {
      logAndThrowError(
        `Error alle examen momenten for label: ${label}, begindatum: ${begindatum}, einddatum: ${einddatum}, typeBijeenkomst: ${typeBijeenkomst}. Error: ${response.Status}`,
        err,
      )
    }

    const examenNummers: number | number[] = response.Examennummer.decimal
    const examentypeNummers: number | number[] =
      response.Examentypenummer.decimal
    const examenTypeOmschrijvingen: string | string[] | undefined =
      response.Examentype_x0020_Omschrijving?.string

    const examenDatums: { DateTime: string }[] =
      response.Examendatum.DateTimeOffset
    const typeExamen: string | string[] | undefined =
      response.Type_x0020_examen?.string
    const branches: string | string[] | undefined = response.Branche?.string
    const locatieNamen: string | string[] | undefined =
      response.Locatie_x0020_Naam?.string
    const locatiePlaatsen: string | string[] | undefined =
      response.Locatie_x0020_Plaats?.string
    const locatiePostcodes: string | string[] | undefined =
      response.Locatie_x0020_Postcode?.string
    const organisatorBedrijfsnamen: string | string[] | undefined =
      response.OrganisatorBedrijfsnaam?.string
    const urls: string | string[] | undefined = response.APIURL?.string
    const prijzen: number | number[] | undefined = response.APIPrijs?.decimal

    for (let index = 0; index < response.AantalResultaten; index++) {
      const examenMoment: AlleExamenMomentenItem = {
        examenNummer: getNewNumberArrayResult<typeof examenNummers>(
          examenNummers,
          index,
        ),
        examenTypeNummer: getNewNumberArrayResult<typeof examentypeNummers>(
          examentypeNummers,
          index,
        ),

        examenTypeOmschrijving: getNewStringArrayResult<
          typeof examenTypeOmschrijvingen
        >(examenTypeOmschrijvingen, index),
        examenDatum: new Date(
          getExamenMomentenDateArrayResult<typeof examenDatums>(
            examenDatums,
            index,
          ),
        ),
        examenDatumString: toDutchDateTime(
          getExamenMomentenDateArrayResult<typeof examenDatums>(
            examenDatums,
            index,
          ),
        ),
        typeExamen: getNewStringArrayResult<typeof typeExamen>(
          typeExamen,
          index,
        ),
        branche: getNewStringArrayResult<typeof branches>(branches, index),
        locatieNaam: getNewStringArrayResult<typeof locatieNamen>(
          locatieNamen,
          index,
        ),
        locatiePostcode: getNewStringArrayResult<typeof locatiePostcodes>(
          locatiePostcodes,
          index,
        ),
        locatiePlaats: getNewStringArrayResult<typeof locatiePlaatsen>(
          locatiePlaatsen,
          index,
        ),
        organisatorBedrijfsnaam: getNewStringArrayResult<
          typeof organisatorBedrijfsnamen
        >(organisatorBedrijfsnamen, index),
        url: getNewStringArrayResult<typeof urls>(urls, index),
        prijs: getNewNumberArrayResult<typeof prijzen>(prijzen, index),
      }
      examenMomenten.push(examenMoment)
    }
  })

  // const searchFilter = (record: AlleExamenMomentenItem) => {
  // 	if (search) {
  // 		const searchTerm = search.toLowerCase();
  // 		const check =
  // 			record.examenTypeOmschrijving.toLowerCase()?.includes(searchTerm) ||
  // 			record.typeExamen.toLowerCase()?.includes(searchTerm) ||
  // 			record.locatieNaam.toLowerCase()?.includes(searchTerm) ||
  // 			record.locatiePlaats.toLowerCase()?.includes(searchTerm);
  // 		return search && search !== "" ? check : true;
  // 	}
  // 	return true;
  // };

  // return examenMomenten;
  return examenMomenten.sort((a, b) => (a.examenDatum > b.examenDatum ? 1 : -1))
}

export interface IAPIAlleExamenmomentenInput {
  /** xs:dateTime(undefined) */
  Einddatum: Date
  /** xs:dateTime(undefined) */
  Begindatum: Date
  /** xs:string(undefined) */
  OrganisatieCode: string
  /** xs:string(undefined) */
  TypeCertificaat: string
  /** xs:string(undefined) */
  TypeBijeenkomst: string
}

export interface IAPIAlleExamenmomentenOutput {
  /** q1:ArrayOfNullableOfdecimal(undefined) */
  Examennummer: { decimal: number[] } // ArrayOfNullableOfdecimal;
  /** q1:ArrayOfNullableOfdecimal(undefined) */
  Examentypenummer: { decimal: number[] } // ArrayOfNullableOfdecimal;
  /** q2:ArrayOfstring(undefined) */
  Examentype_x0020_Omschrijving?: { string: string[] }
  /** q3:ArrayOfNullableOfDateTimeOffset5F2dSckg(undefined) */
  Examendatum: {
    DateTimeOffset: {
      $: Object
      DateTime: string
      OffsetMinutes: string
    }[]
  } // ArrayOfNullableOfDateTimeOffset5F2dSckg;
  /** xs:decimal(undefined) */
  AantalResultaten: number
  /** q?4:string[](undefined) */
  Type_x0020_examen?: { string: string[] }
  /** xs:string(undefined) */
  Status: string
  /** q?5:string[](undefined) */
  Branche?: { string: string[] }
  /** q?6:string[](undefined) */
  Locatie_x0020_Naam?: { string: string[] }
  /** q?7:string[](undefined) */
  Locatie_x0020_Plaats?: { string: string[] }
  Locatie_x0020_Postcode?: { string: string[] }
  APIURL: { string: string[] }
  APIPrijs: { decimal: number[] }
  OrganisatorBedrijfsnaam: { string: string[] }
}

export interface AlleExamenMomentenItem {
  examenNummer: number
  examenTypeNummer: number
  examenTypeOmschrijving: string
  examenDatum: Date
  examenDatumString: string
  typeExamen: string
  // status: string;
  branche: string
  locatieNaam: string
  locatiePostcode: string
  locatiePlaats: string
  organisatorBedrijfsnaam: string
  url: string
  prijs: number
}

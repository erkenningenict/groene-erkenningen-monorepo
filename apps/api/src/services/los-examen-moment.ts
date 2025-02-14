import { processors, parseString } from 'xml2js'
import type { SoapDecimal, SoapString } from '../utils/utils'
import {
  getNullableString,
  getNullableNumber,
  getSoapBody,
  euroFormatter,
  getNewDateResult,
  logAndThrowError,
} from '../utils/utils'
import logger from '../utils/logger'
import env from '../utils/env'
import type { SelectConfig } from '../db/schema'

const parseStringPromise = promisify(parseString)

function promisify(parseString: any) {
  return function (str: string, options: any) {
    return new Promise((resolve, reject) => {
      parseString(str, options, (err: Error, result: any) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }
}

export async function losExamenMoment({
  config,
  examenTypeNummer,
  examenNummer,
}: {
  config: SelectConfig
  examenTypeNummer: number
  examenNummer: number
}) {
  const username = env.EXAMEN_SERVICES_API_USERNAME
  const password = env.PASSWORD_LOS_EXAMEN_MOMENT
  const soapUrl = env.SOAP_URL_LOS_EXAMEN_MOMENT
  const organisationCode = config.organisationCode

  logger.info(
    `LosExamenMoment, label: ${config.label}, examenTypeNummer: ${examenTypeNummer}, examennummer: ${examenNummer}`,
  )
  // const nummer = 549830;

  const soapRequestBody = `<soap:APILosExamenmoment><soap:Organisatiecode>${organisationCode}</soap:Organisatiecode><soap:Examennummer>${examenNummer}</soap:Examennummer><soap:Examentypenummer>${examenTypeNummer}</soap:Examentypenummer></soap:APILosExamenmoment>`

  if (process.env.E2E === 'true') {
    // const xml = getMockFile("./mocks/los-examen-moment.xml");
    // return losExamenMomentToJs(xml, label, examenTypeNummer, examenNummer);
  }
  const body = await getSoapBody(
    soapUrl,
    'http://www.triggre.com/2018/soap/Service/APILosExamenmoment',
    username,
    password,
    soapRequestBody,
    `label: ${config.label}, examenTypeNummer: ${examenTypeNummer}, examenNummer: ${examenNummer}`,
  )

  return losExamenMomentToJs(body, config.label, examenTypeNummer, examenNummer)
}

export async function losExamenMomentToJs(
  xml: string,
  label: string,
  examenTypeNummer: number,
  examenNummer: number,
) {
  const options = {
    tagNameProcessors: [processors.stripPrefix],
    explicitArray: false,
  }

  try {
    let losExamenMoment: LosExamenmoment = {} as LosExamenmoment

    const result = (await parseStringPromise(xml, options)) as {
      Envelope: {
        Body: { APILosExamenmomentResponse: IAPILosExamenmomentOutput }
      }
    }

    const response = result.Envelope.Body.APILosExamenmomentResponse
    logger.debug(`Response: ${response.Status}`)

    if (response.Status !== 'OK') {
      return logAndThrowError(
        `Error alleExamenMomentenToJs label: ${label}, examenTypeNummer: ${examenTypeNummer}, examenNummer: ${examenNummer}. Status: ${response?.Status}`,
        new Error(response?.Status.toString()),
      )
    }

    losExamenMoment = {
      examennummer: response.Examennummer,
      examendatum: getNewDateResult(response.Examendatum.DateTime),
      einddatumExamen: getNewDateResult(response.EinddatumExamen.DateTime),
      examentype: getNullableString(response.Examentype),
      examentypeCode: getNullableString(response.ExamentypeCode),
      examentypeOmschrijving: getNullableString(
        response.ExamentypeOmschrijving,
      ),
      status: getNullableString(response.Status),
      totaalAantalPlekken: +response.TotaalAantalPlekken,
      openPlekken: +response.OpenPlekken,
      locatieNaam: getNullableString(response.LocatieNaam),
      locatiePostcode: getNullableString(response.LocatiePostcode),
      locatiePlaats: getNullableString(response.LocatiePlaats),
      branche: getNullableString(response.Branche),
      organisatorBedrijfsnaam: getNullableString(
        response.OrganisatorBedrijfsnaam,
      ),
      organisatorStraat: getNullableString(response.OrganisatorStraat),
      organisatorHuisnummer: getNullableString(response.OrganisatorHuisnummer),
      organisatorToevoeging: getNullableString(response.OrganisatorToevoeging),
      organisatorPlaats: getNullableString(response.OrganisatorPlaats),
      organisatorEmail: getNullableString(response.OrganisatorEmail),
      organisatorTelefoon: getNullableString(response.OrganisatorTelefoon),
      url: getNullableString(response.APIURL),
      prijs: euroFormatter.format(getNullableNumber(response.APIPrijs)),
    }

    //   console.log('#DH# vrolijk hier')
    logger.info(`Los examen moment data: ${JSON.stringify(losExamenMoment)}`)
    return losExamenMoment
    // // } catch (err) {
    //   throw err
  } catch (err) {
    console.log('#DH# error', err)

    logAndThrowError(
      `Error parse string at alleExamenMomentenToJs for label: ${label}, examenTypeNummer: ${examenTypeNummer}, examenNummer: ${examenNummer}: ${err}`,
      err,
    )
  }
}

export interface IAPILosExamenmomentInput {
  /** xs:string(undefined) */
  Organisatiecode: string
  /** xs:decimal(undefined) */
  Examennummer: number
  /** xs:decimal(undefined) */
  Examentypenummer: number
}

export interface SoapDate {
  DateTime: string
  OffsetMinutes: number
}

export interface IAPILosExamenmomentOutput {
  /** xs:string(undefined) */
  OrganisatorHuisnummer: SoapString
  /** xs:string(undefined) */
  OrganisatorStraat: SoapString
  /** xs:string(undefined) */
  ExamentypeCode: SoapString
  /** xs:decimal(undefined) */
  Examennummer: number
  /** xs:string(undefined) */
  LocatiePlaats: SoapString
  /** xs:string(undefined) */
  OrganisatorPlaats: SoapString
  /** xs:decimal(undefined) */
  TotaalAantalPlekken: number
  /** xs:decimal(undefined) */
  OpenPlekken: number
  /** xs:string(undefined) */
  ExamentypeOmschrijving: SoapString
  /** xs:string(undefined) */
  Status: SoapString
  /** q1:DateTimeOffset(undefined) */
  Examendatum: SoapDate
  /** xs:string(undefined) */
  LocatiePostcode: SoapString
  /** xs:string(undefined) */
  LocatieNaam: SoapString
  /** xs:string(undefined) */
  OrganisatorToevoeging: SoapString
  /** xs:string(undefined) */
  Branche: SoapString
  /** q2:DateTimeOffset(undefined) */
  EinddatumExamen: { DateTime: string; OffsetMinutes: number }
  /** xs:string(undefined) */
  OrganisatorTelefoon: string
  /** xs:string(undefined) */
  Examentype: SoapString
  /** xs:string(undefined) */
  OrganisatorEmail: SoapString
  /** xs:string(undefined) */
  OrganisatorBedrijfsnaam: SoapString
  APIURL: SoapString
  APIPrijs: SoapDecimal
}

export interface LosExamenmoment {
  /** xs:decimal(undefined) */
  examennummer: number
  /** q1:DateTimeOffset(undefined) */
  examendatum: Date
  /** q2:DateTimeOffset(undefined) */
  einddatumExamen: Date
  /** xs:string(undefined) */
  examentype: string
  /** xs:string(undefined) */
  examentypeOmschrijving: string
  /** xs:string(undefined) */
  examentypeCode: string
  /** xs:decimal(undefined) */
  totaalAantalPlekken: number
  /** xs:decimal(undefined) */
  openPlekken: number
  /** xs:string(undefined) */
  status: string

  /** xs:string(undefined) */
  locatieNaam: string
  /** xs:string(undefined) */
  locatiePostcode: string
  /** xs:string(undefined) */
  locatiePlaats: string
  branche: string
  /** xs:string(undefined) */
  organisatorBedrijfsnaam: string
  /** xs:string(undefined) */
  organisatorStraat: string
  /** xs:string(undefined) */
  organisatorHuisnummer: string
  /** xs:string(undefined) */
  organisatorToevoeging: string
  /** xs:string(undefined) */
  organisatorPlaats: string
  /** xs:string(undefined) */
  organisatorEmail: string
  /** xs:string(undefined) */
  organisatorTelefoon: string
  url: string
  prijs: string
}

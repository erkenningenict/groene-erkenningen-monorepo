import { parseString, processors } from 'xml2js'
import {
  getCheckCertificaatDateArrayResult,
  getNewNumberArrayResult,
  getNewStringArrayResult,
  getSoapBody,
  type SoapDecimal,
  type SoapNewString,
  logAndThrowError,
} from '../utils/utils'
import logger from '../utils/logger'
import type { LabelTypes } from './labelConfiguration'
import env from '../utils/env'

export async function checkCertificate(
  search: string,
  certificate: string,
  label: LabelTypes,
): Promise<Student[] | undefined> {
  const username = env.EXAMEN_SERVICES_API_USERNAME
  const password = env.PASSWORD_CHECK_CERTIFICAAT
  const soapUrl = env.SOAP_URL_CHECK_CERTIFICAAT
  const organisationCode = env.ORGANISATION_CODE_CHECK_CERTIFICAAT

  const soapRequestBody = `<soap:APICheckCertificaat><soap:ZoekAchternaam>${search}</soap:ZoekAchternaam><soap:OrganisatieCode>${organisationCode}</soap:OrganisatieCode><soap:TypeCertificaat>${certificate}</soap:TypeCertificaat></soap:APICheckCertificaat>`

  // if (process.env.E2E === 'true') {
  //   const xml = await getMockFile('./mocks/check-certificaat-new1.xml')
  //   return checkCertificateToJs(xml, label)
  // }
  const body = await getSoapBody(
    soapUrl,
    'http://www.triggre.com/2018/soap/Service/APICheckCertificaat',
    username,
    password,
    soapRequestBody,
    `label: ${label}, search: ${search}, certificate: ${certificate}`,
  )

  return checkCertificateToJs(body, label)
}

export function checkCertificateToJs(
  xml: string,
  label: LabelTypes,
): Student[] {
  const options = {
    tagNameProcessors: [processors.stripPrefix],
    explicitArray: false,
  }

  let students: Student[] = []
  parseString(xml, options, (err: any, result: any) => {
    if (err) {
      logAndThrowError(
        `Error parse string at checkCertificateToJs for ${label}: ${err}`,
        err,
      )
    }
    const response = result.Envelope.Body.APICheckCertificaatResponse

    const voorletters: SoapNewString[] = response.Voorletters.string
    const tussenvoegsels: SoapNewString[] | string =
      response.Tussenvoegsel.string
    const achternamen: SoapNewString[] = response.Achternaam.string
    const startDatums: string = response.Startdatum.dateTime
    const geboorteJaren: SoapDecimal[] | SoapDecimal =
      response.Geboortejaar.decimal
    const verloopDatums: string = response.Verloopdatum.dateTime
    const typeCertificaat: string = response.TypeCertificaat

    for (let index = 0; index < response.AantalResultaten; index++) {
      const tussenvoegsel = getNewStringArrayResult(tussenvoegsels, index) ?? ''
      const achternaam = getNewStringArrayResult(achternamen, index) ?? ''
      const voorletterString = getNewStringArrayResult(voorletters, index) ?? ''

      const startDatum =
        getCheckCertificaatDateArrayResult(startDatums, index) ?? 'Onbekend'
      const verloopDatum =
        getCheckCertificaatDateArrayResult(verloopDatums, index) ??
        new Date().toISOString()
      const geboorteJaarValue = getNewNumberArrayResult(geboorteJaren, index)
      const geboorteJaar =
        geboorteJaarValue === 0 ? 'Onbekend' : geboorteJaarValue

      const newStudent: Student = {
        id: `${voorletterString?.trim() ?? ''}_${
          (typeof tussenvoegsel === 'string' ? tussenvoegsel?.trim() : '') ?? ''
        }_${achternaam?.trim() ?? ''}`,
        achternaam:
          (typeof tussenvoegsel === 'object'
            ? achternaam?.trim()
            : tussenvoegsel?.trim() === ''
              ? achternaam?.trim()
              : `${tussenvoegsel?.trim()} ${achternaam?.trim()}`) ?? '',
        initialen: voorletterString?.trim(),
        geboorteJaar: geboorteJaar.toString(),
        certificaten: [
          {
            beginDatum: startDatum,
            eindDatum: verloopDatum,
            certCode: typeCertificaat,
          },
        ],
      }
      students.push(newStudent)
    }
  })
  return students
}

export async function getStudentsByName(
  label: LabelTypes,
  searchString: string,
  certificate: string,
) {
  if (!label) {
    return
  }
  if (!searchString && searchString.length < 2) {
    return
  }
  if (!certificate) {
    return
  }
  // get all
  // const certs = certificatesByLabel(label).map((c) => c);
  logger.info(`Search for label ${label} with searchString: "${searchString}"`)
  logger.info(`Certificate to fetch data for: "${certificate}"`)

  // let requests: Promise<Student[]>[] = [];
  // SOAP interface can only fetch data for 1 certificate, so make multiple call
  const requests = [certificate].map(cert =>
    checkCertificate(searchString, cert, label),
  )

  // combine all the results
  const res = await Promise.all(requests)
  const json = res
    .flatMap(r => r)
    .sort((a, b) =>
      a?.achternaam && b?.achternaam
        ? a.achternaam > b.achternaam
          ? 1
          : -1
        : 0,
    )
  // .filter((s) =>
  //   s?.certificaten.at(0)?.eindDatum
  //     ? new Date(s?.certificaten.at(0)?.eindDatum) >= new Date()
  //     : false
  // );
  // const json = { message: "test" };

  // return result
  return json
}

export interface Student {
  id: string // has dummy value
  achternaam: string
  initialen: string
  geboorteJaar: string
  certificaten: Certificaat[]
}

export interface Certificaat {
  beginDatum: string
  eindDatum: string
  certCode: string
}

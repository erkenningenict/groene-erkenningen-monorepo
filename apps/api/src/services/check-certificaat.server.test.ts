import fs from 'fs'
import path from 'path'
import {
  checkCertificateToJs,
  getStudentsByName,
} from './check-certificaat.server'
import * as utils from '../utils/utils'
import { LabelTypes } from './labelConfiguration'
import { afterEach, describe, expect, it, spyOn } from 'bun:test'

describe('getStudentsByName()', () => {
  let spy: any
  afterEach(() => {
    spy.mockRestore()
  })

  it('should return data', async () => {
    spy = spyOn(utils, 'getSoapBody')
    // const spyEnvs = vi.spyOn(utils, 'getStringEnvVar')
    const xml = fs.readFileSync(
      path.resolve(__dirname, '../../mocks/check-certificaat-new1.xml'),
      'utf-8',
    )

    // spyEnvs.mockReturnValue('test')
    spy.mockResolvedValue(xml)

    const res = await getStudentsByName(
      'aocKeurmerk' as LabelTypes,
      'ja',
      'Veilig werken op hoogte',
    )

    expect(spy).toBeCalledWith(
      'https://mijn.ibki.nl/main/interfaces/soap11/apicheckcertificaat?wsdl',
      'http://www.triggre.com/2018/soap/Service/APICheckCertificaat',
      'triggre-Main',
      'test',
      `<soap:APICheckCertificaat><soap:ZoekAchternaam>ja</soap:ZoekAchternaam><soap:OrganisatieCode>test</soap:OrganisatieCode><soap:TypeCertificaat>Veilig werken op hoogte</soap:TypeCertificaat></soap:APICheckCertificaat>`,
      'label: aocKeurmerk, search: ja, certificate: Veilig werken op hoogte',
    )
    expect(spy).toBeCalledTimes(1)

    expect(res?.length).toEqual(1)

    expect(res?.at(0)).toEqual({
      achternaam: 'Jansen of Lorkeers',
      certificaten: [
        {
          beginDatum: '2008-12-09T00:00:00',
          certCode: 'Bestrijdingstechnicus',
          eindDatum: '2028-12-09T00:00:00',
        },
      ],
      id: 'R.H.R.__Jansen of Lorkeers',
      geboorteJaar: '1986',
      initialen: 'R.H.R.',
    })
  })

  it('should return data for 1', async () => {
    spy = spyOn(utils, 'getSoapBody')
    // const spyEnvs = vi.spyOn(utils, 'getStringEnvVar')
    const xml = fs.readFileSync(
      path.resolve(__dirname, '../../mocks/check-certificaat1.xml'),
      'utf-8',
    )

    spy.mockResolvedValue(xml)

    const res = await getStudentsByName(
      LabelTypes.aocKeurmerk,
      'ja',
      'Veilig werken op hoogte',
    )

    expect(spy).toBeCalledWith(
      'https://mijn.ibki.nl/main/interfaces/soap11/apicheckcertificaat?wsdl',
      'http://www.triggre.com/2018/soap/Service/APICheckCertificaat',
      'triggre-Main',
      'test',
      `<soap:APICheckCertificaat><soap:ZoekAchternaam>ja</soap:ZoekAchternaam><soap:OrganisatieCode>test</soap:OrganisatieCode><soap:TypeCertificaat>Veilig werken op hoogte</soap:TypeCertificaat></soap:APICheckCertificaat>`,
      'label: AOC Keurmerk, search: ja, certificate: Veilig werken op hoogte',
    )
    expect(spy).toBeCalledTimes(1)

    expect(res?.length).toEqual(1)

    expect(res?.at(0)?.achternaam).toEqual('Janknegt')
    expect(res?.at(0)?.id).toEqual('J.__Janknegt')
    expect(res?.at(0)).toEqual({
      achternaam: 'Janknegt',
      certificaten: [
        {
          beginDatum: '2023-03-07T00:00:00',
          certCode: 'Veilig werken op hoogte',
          eindDatum: '2028-03-07T00:00:00',
        },
      ],
      id: 'J.__Janknegt',
      geboorteJaar: '1998',
      initialen: 'J.',
    })
  })

  it('should return data for geboortejaar null in single item', async () => {
    spy = spyOn(utils, 'getSoapBody')
    const xml = fs.readFileSync(
      path.resolve(__dirname, '../../mocks/geboortejaar-nil-new1.xml'),
      'utf-8',
    )

    // spyEnvs.mockReturnValue('test')
    spy.mockResolvedValue(xml)

    const res = await getStudentsByName(
      'aocKeurmerk' as LabelTypes,
      'ja',
      'Kleurkeur basis',
    )

    expect(spy).toBeCalledWith(
      'https://mijn.ibki.nl/main/interfaces/soap11/apicheckcertificaat?wsdl',
      'http://www.triggre.com/2018/soap/Service/APICheckCertificaat',
      'triggre-Main',
      'test',
      `<soap:APICheckCertificaat><soap:ZoekAchternaam>ja</soap:ZoekAchternaam><soap:OrganisatieCode>test</soap:OrganisatieCode><soap:TypeCertificaat>Kleurkeur basis</soap:TypeCertificaat></soap:APICheckCertificaat>`,
      'label: aocKeurmerk, search: ja, certificate: Kleurkeur basis',
    )
    expect(spy).toBeCalledTimes(1)

    expect(res?.length).toEqual(1)

    expect(res?.at(0)).toEqual({
      achternaam: 'Mol',
      certificaten: [
        {
          beginDatum: '2020-09-17T00:00:00',
          certCode: 'Kleurkeur basis',
          eindDatum: '2025-09-17T00:00:00',
        },
      ],
      id: 'D.__Mol',
      geboorteJaar: 'Onbekend',
      initialen: 'D.',
    })
  })

  it('should return data for geboortejaar null for array', async () => {
    spy = spyOn(utils, 'getSoapBody')
    // const spyEnvs = vi.spyOn(utils, 'getStringEnvVar')
    const xml = fs.readFileSync(
      path.resolve(__dirname, '../../mocks/geboortejaar-nil-array-new1.xml'),
      'utf-8',
    )

    // spyEnvs.mockReturnValue('test')
    spy.mockResolvedValue(xml)

    const res = await getStudentsByName(
      'aocKeurmerk' as LabelTypes,
      'ja',
      'Kleurkeur basis',
    )

    expect(spy).toBeCalledWith(
      'https://mijn.ibki.nl/main/interfaces/soap11/apicheckcertificaat?wsdl',
      'http://www.triggre.com/2018/soap/Service/APICheckCertificaat',
      'triggre-Main',
      'test',
      `<soap:APICheckCertificaat><soap:ZoekAchternaam>ja</soap:ZoekAchternaam><soap:OrganisatieCode>test</soap:OrganisatieCode><soap:TypeCertificaat>Kleurkeur basis</soap:TypeCertificaat></soap:APICheckCertificaat>`,
      'label: aocKeurmerk, search: ja, certificate: Kleurkeur basis',
    )
    expect(spy).toBeCalledTimes(1)

    expect(res?.length).toEqual(7)

    const mol = res?.at(0)
    expect(mol?.achternaam).toEqual('Mol')
    expect(mol?.geboorteJaar).toEqual('Onbekend')
    expect(mol?.initialen).toEqual('D.')
    expect(mol?.id).toEqual('D.__Mol')
    expect(mol?.certificaten.at(0)?.beginDatum).toEqual('2020-09-17T00:00:00')
    expect(mol?.certificaten.at(0)?.eindDatum).toEqual('2025-09-17T00:00:00')
    expect(mol?.certificaten.at(0)?.certCode).toEqual('Kleurkeur basis')

    const molenaarZonderGeboortedatum = res?.at(2)

    expect(molenaarZonderGeboortedatum?.achternaam).toEqual('Molenaar')
    expect(molenaarZonderGeboortedatum?.geboorteJaar).toEqual('Onbekend')
    expect(molenaarZonderGeboortedatum?.initialen).toEqual('J.')
    expect(molenaarZonderGeboortedatum?.id).toEqual('J.__Molenaar')
    expect(molenaarZonderGeboortedatum?.certificaten.at(0)?.beginDatum).toEqual(
      '2020-01-21T00:00:00',
    )
    expect(molenaarZonderGeboortedatum?.certificaten.at(0)?.eindDatum).toEqual(
      '2025-01-21T00:00:00',
    )
    expect(molenaarZonderGeboortedatum?.certificaten.at(0)?.certCode).toEqual(
      'Kleurkeur basis',
    )
  })
})

describe('checkCertificateToJs()', () => {
  it('should convert xml', () => {
    const xml = fs.readFileSync(
      path.join(__dirname, '..', '..', 'mocks', 'check-certificaat-new1.xml'),
      'utf-8',
    )

    const res = checkCertificateToJs(xml, LabelTypes.groenkeur)
    expect(res.length).toBe(1)

    const firstRes = res.at(0)
    expect(firstRes?.achternaam).toBe('Jansen of Lorkeers')
    expect(firstRes?.initialen).toBe('R.H.R.')
    expect(firstRes?.certificaten.length).toBe(1)
    expect(firstRes?.certificaten.at(0)?.certCode).toBe('Bestrijdingstechnicus')
    expect(firstRes?.certificaten.at(0)?.beginDatum).toBe('2008-12-09T00:00:00')
    expect(firstRes?.certificaten.at(0)?.eindDatum).toBe('2028-12-09T00:00:00')

    // const secondRes = res.at(1);
    // expect(secondRes?.achternaam).toBe("Janssen");
  })
})

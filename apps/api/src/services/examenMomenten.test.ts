// import { describe, expect, it, spyOn } from 'bun:test'
// import { alleExamenMomenten, alleExamenMomentenToJs } from './examenMomenten'
// import { LabelTypes } from './labelConfiguration'
// import * as utils from '../utils/utils'
// import fs from 'fs'

// describe('examenMomenten()', () => {
//   it('should return mock data', async () => {
//     const spy = spyOn(utils, 'getSoapBody')
//     const xml = fs.readFileSync('./mocks/alle-examen-momenten-new.xml', 'utf-8')

//     spy.mockResolvedValue(xml)

//     const res = await alleExamenMomenten(
//       { label: 'APK' } as any,
//       'Kennisbijeenkomst',
//     )

//     // expect(spy).toBeCalledWith(
//     //   'test',
//     //   'http://www.triggre.com/2018/soap/Service/APIAlleExamenmomenten',
//     //   'test',
//     //   'test',
//     //   `<soap:APIAlleExamenmomenten><soap:Einddatum>undefined</soap:Einddatum><soap:Begindatum>undefined</soap:Begindatum><soap:OrganisatieCode>test</soap:OrganisatieCode><soap:TypeCertificaat>APK</soap:TypeCertificaat><soap:TypeBijeenkomst>dezeIsNuNietIngesteld</soap:TypeBijeenkomst></soap:APIAlleExamenmomenten>`,
//     // )
//     expect(spy).toBeCalledTimes(1)

//     expect(res?.length).toBe(2)
//     const firstExamenmoment = res?.at(0)
//     expect(firstExamenmoment?.examenNummer).toEqual(694426)
//     expect(firstExamenmoment?.examenTypeNummer).toEqual(10819)
//     expect(firstExamenmoment?.examenTypeOmschrijving).toEqual(
//       'Examen Kleurkeur Gevorderde (herkansing)',
//     )
//     expect(firstExamenmoment?.examenDatum).toEqual(
//       new Date('2024-07-16T17:00:00Z'),
//     )
//     expect(firstExamenmoment?.typeExamen).toEqual(
//       'Kleurkeur Gevorderde (herkansing)',
//     )
//     expect(firstExamenmoment?.branche).toEqual('Kleurkeur')
//     expect(firstExamenmoment?.locatieNaam).toEqual('Examencentrum Nieuwegein')
//     expect(firstExamenmoment?.locatiePlaats).toEqual('NIEUWEGEIN')
//   })

//   it.skip('should return data from actual API', async () => {
//     const res = await alleExamenMomenten(
//       { label: 'APK' } as any,
//       'Kennisbijeenkomst',
//     )
//     expect(res?.length).toBe(5)

//     const firstExamenmoment = res?.at(0)
//     expect(firstExamenmoment?.examenNummer).toEqual(549534)
//     expect(firstExamenmoment?.examenTypeOmschrijving).toEqual(
//       'Keurmeester Periodieke Keuring Lichte Voertuigen',
//     )
//     expect(firstExamenmoment?.examenDatum).toEqual(
//       new Date('2023-01-22T08:00:00Z'),
//     )
//     expect(firstExamenmoment?.typeExamen).toEqual('APK Lichte voertuigen')
//     expect(firstExamenmoment?.branche).toEqual('Personenauto')
//     expect(firstExamenmoment?.locatieNaam).toEqual('Examencentrum Nieuwegein')
//     expect(firstExamenmoment?.locatiePlaats).toEqual('NIEUWEGEIN')
//   })

//   describe('alleExamenMomentenToJs()', () => {
//     it('should', async () => {
//       const xml = fs.readFileSync(
//         './mocks/alle-examen-momenten-new.xml',
//         'utf-8',
//       )
//       const res = alleExamenMomentenToJs(xml, LabelTypes.groenkeur)
//       expect(res.length).toEqual(2)

//       const firstExamenmoment = res?.at(0)
//       expect(firstExamenmoment?.examenNummer).toEqual(694426)
//       expect(firstExamenmoment?.examenTypeOmschrijving).toEqual(
//         'Examen Kleurkeur Gevorderde (herkansing)',
//       )
//       expect(firstExamenmoment?.examenDatum).toEqual(
//         new Date('2024-07-16T17:00:00Z'),
//       )
//       expect(firstExamenmoment?.typeExamen).toEqual(
//         'Kleurkeur Gevorderde (herkansing)',
//       )
//       expect(firstExamenmoment?.branche).toEqual('Kleurkeur')

//       expect(firstExamenmoment?.locatieNaam).toMatch('Examencentrum Nieuwegein')
//       expect(firstExamenmoment?.locatiePlaats).toEqual('NIEUWEGEIN')
//     })

//     it('should return empty', async () => {
//       const xml = fs.readFileSync(
//         './mocks/alle-examen-momenten-leeg.xml',
//         'utf-8',
//       )
//       const res = alleExamenMomentenToJs(xml, LabelTypes.groenkeur)
//       expect(res.length).toEqual(0)
//     })
//   })
// })

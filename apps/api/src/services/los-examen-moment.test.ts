import { losExamenMoment } from './los-examen-moment'
import * as utils from '../utils/utils'
import fs from 'fs'
import { afterEach, describe, expect, it, vi } from 'vitest'

describe('losExamenMoment()', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  // it("should return mock data from xml file", async () => {
  // 	const spy = vi.spyOn(utils, "getSoapBody");
  // 	const xml = fs.readFileSync("./mocks/los-examen-moment.xml", "utf-8");

  // 	// spyEnvs.mockReturnValue("test");
  // 	spy.mockResolvedValue(xml);

  // 	const res = await losExamenMoment('aocKeurmerk', 1, 549830);

  // 	expect(spy).toBeCalledWith(
  // 		"test",
  // 		"http://www.triggre.com/2018/soap/Service/APILosExamenmoment",
  // 		"test",
  // 		"test",
  // 		`<soap:APILosExamenmoment><soap:Organisatiecode>test</soap:Organisatiecode><soap:Examennummer>549830</soap:Examennummer><soap:Examentypenummer>1</soap:Examentypenummer></soap:APILosExamenmoment>`,
  // 	);
  // 	expect(spy).toBeCalledTimes(1);

  // 	expect(res?.examendatum).toEqual(new Date("2024-06-28T06:00:00Z"));
  // 	expect(res?.einddatumExamen).toEqual(new Date("2024-06-28T07:30:00Z"));
  // 	expect(res?.examentype).toEqual("Bestrijdingstechnicus Praktijk");
  // 	expect(res?.examentypeCode).toEqual("RPMV_BT_PE");
  // 	expect(res?.examentypeOmschrijving).toEqual(
  // 		"Bestrijdingstechnicus Praktijk",
  // 	);
  // 	expect(res?.totaalAantalPlekken).toEqual(1);
  // 	expect(res?.openPlekken).toEqual(0);
  // 	expect(res?.locatieNaam).toEqual("Lestrix LEUSDEN");
  // 	expect(res?.locatiePostcode).toEqual("3831 KE");
  // 	expect(res?.locatiePlaats).toEqual("LEUSDEN");
  // 	expect(res?.branche).toEqual("RPMV");
  // 	expect(res?.organisatorBedrijfsnaam).toEqual("");
  // 	expect(res?.organisatorStraat).toEqual("");
  // 	expect(res?.organisatorHuisnummer).toEqual("");
  // 	expect(res?.organisatorToevoeging).toEqual("");
  // 	expect(res?.organisatorPlaats).toEqual("");
  // 	expect(res?.organisatorEmail).toEqual("");
  // 	expect(res?.organisatorTelefoon).toEqual("");
  // });
})

import { describe, expect, it } from 'bun:test'
import {
  examenMomentenProcessor,
  setCertificateType,
  type CertificateTypeConfiguration,
} from './examenMomentenProcessor'
import type { AlleExamenMomentenItem } from './examenMomenten'

describe('ExamenMomentenProcessor', () => {
  it(
    'should run',
    async () => {
      const res = await examenMomentenProcessor()
    },
    { timeout: 100000 },
  )
})

describe.only('setCertificateType', () => {
  it('should return same examen type omschrijving when config is missing', () => {
    const row: Partial<AlleExamenMomentenItem> = {
      typeExamen: 'Examen',
    }
    const config = null
    const res = setCertificateType(row as AlleExamenMomentenItem, config)
    expect(res).toEqual({
      typeExamen: 'Examen',
      certificaatType: undefined,
    })
  })

  it('should return the correct certificate type and description', () => {
    const row: Partial<AlleExamenMomentenItem> = {
      typeExamen: 'Kennisbijeenkomst UG: webinar',
    }
    const config: CertificateTypeConfiguration = {
      certificateMatcher: 'Kennisbijeenkomst\\s([A-Z]{1,3}):',
    }
    const res = setCertificateType(row as AlleExamenMomentenItem, config)
    expect(res).toEqual({
      typeExamen: 'webinar',
      certificaatType: 'UG',
    })
  })

  it('should return the correct certificate type and description', () => {
    const row: Partial<AlleExamenMomentenItem> = {
      typeExamen: 'Kennisbijeenkomst MEW: Zelf mollen en woelratten bestrijden',
    }
    const config = {
      certificateMatcher: 'Kennisbijeenkomst\\s([A-Z]{1,3}):',
    }
    const res = setCertificateType(row as AlleExamenMomentenItem, config)
    expect(res).toEqual({
      typeExamen: 'Zelf mollen en woelratten bestrijden',
      certificaatType: 'MEW',
    })
  })

  it('should return the correct certificate type and description', () => {
    const row: Partial<AlleExamenMomentenItem> = {
      typeExamen: 'Boomveiligheidscontroleur - theorie',
    }
    const config = {
      certificateMatcher: 'ALL',
    }
    const res = setCertificateType(row as AlleExamenMomentenItem, config)
    expect(res).toEqual({
      typeExamen: 'Boomveiligheidscontroleur - theorie',
      certificaatType: 'Boomveiligheidscontroleur - theorie',
    })
  })
})

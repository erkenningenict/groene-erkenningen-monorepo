import { describe, expect, it } from 'vitest'
import {
  corsMatcher,
  getBasicAuth,
  getExamenMomentenDateArrayResult,
} from './utils'

describe('getBasicAuth()', () => {
  it('should return correct', () => {
    const res = getBasicAuth('test', 'test')
    expect(res).toBe('dGVzdDp0ZXN0')
  })
})

describe('corsMatcher()', () => {
  const corsExamples = [
    'https:\/\/[a-zA-Z0-9-]+--groene-erkenningen-calendar\.netlify\.app',
    'https:\/\/groene-erkenningen-calendar\.netlify\.app',
    'https:\/\/deploy-preview-[0-9]{1,3}--groene-erkenningen-public-register\.netlify\.app',
    'https:\/\/acc--groene-erkenningen-public-register\.netlify\.app',
    'http://localhost:3000',
  ]
  it('should match simple string', () => {
    const res = corsMatcher('http://localhost:3000', corsExamples)
    expect(res).toBe(true)
  })

  it('should match regex for netlify preview deploy', () => {
    const res = corsMatcher(
      'https://67b057f0b3700600087e8215--groene-erkenningen-calendar.netlify.app',
      corsExamples,
    )
    expect(res).toBe(true)
  })

  it('should match regex for netlify preview deploy', () => {
    const res = corsMatcher(
      'https://deploy-preview-3--groene-erkenningen-public-register.netlify.app',
      corsExamples,
    )
    expect(res).toBe(true)
  })

  it('should match regex for netlify acc branch', () => {
    const res = corsMatcher(
      'https://acc--groene-erkenningen-public-register.netlify.app',
      corsExamples,
    )
    expect(res).toBe(true)
  })
})

describe('getExamenMomentenDateArrayResult()', () => {
  it('should return correct date for a single date', () => {
    const res = getExamenMomentenDateArrayResult(
      {
        $: {
          xmlns: 'http://schemas.datacontract.org/2004/07/System',
        },
        DateTime: '2026-06-02T11:00:00Z',
        OffsetMinutes: '0',
      },
      0,
    )
    expect(res).toBe('2026-06-02T11:00:00Z')
  })

  it('should return correct date for a single date with array', () => {
    const res = getExamenMomentenDateArrayResult(
      [
        {
          $: {
            xmlns: 'http://schemas.datacontract.org/2004/07/System',
          },
          DateTime: '2026-06-02T11:00:00Z',
          OffsetMinutes: '0',
        },
        {
          $: {
            xmlns: 'http://schemas.datacontract.org/2004/07/System',
          },
          DateTime: '2026-06-03T11:00:00Z',
          OffsetMinutes: '0',
        },
      ],
      1,
    )
    expect(res).toBe('2026-06-03T11:00:00Z')
  })
})

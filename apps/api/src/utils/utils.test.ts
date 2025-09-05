import { describe, expect, it } from 'bun:test'
import { corsMatcher, getBasicAuth } from './utils'

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

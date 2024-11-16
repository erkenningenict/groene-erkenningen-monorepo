import { describe, expect, test } from 'bun:test'
import { getBasicAuth } from './utils'

describe.skip('getBasicAuth()', () => {
  test('should return correct', () => {
    const res = getBasicAuth('test', 'test')
    expect(res).toBe('dGVzdDp0ZXN0')
  })
})

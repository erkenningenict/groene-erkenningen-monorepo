import { describe, expect, it } from 'vitest'
import { sendSlackErrorMessage } from './slack'

// Skipping because it actually calls the slack api
describe.skip('Slack', () => {
  it('sendSlackErrorMessage()', async () => {
    const res = await sendSlackErrorMessage({
      channel: 'aocraadtech',
      message: 'Test slack message sending with some an error message',
      error: 'some error message',
    })
    expect(res).toBeUndefined()
  })
})

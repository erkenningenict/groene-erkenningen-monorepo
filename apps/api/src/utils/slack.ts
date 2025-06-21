import env from './env'
import logger from './logger'

export const sendSlackMessage = async (
  channel: string,
  message: string,
): Promise<void> => {
  try {
    const url = env.SLACK_API_URL as string

    await fetch(url, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${env.SLACK_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channel: channel,
        text: `MGE: ${message}`,
      }),
    })
  } catch (err) {
    logger.error(
      `Could not send slack message: channel: ${channel}, message: ${message}, err:${err}`,
    )
  }
}

export const sendSlackErrorMessage = async ({
  channel = 'aocraadtech',
  message,
  error,
}: {
  channel?: string
  message: string
  error: any
}): Promise<void> => {
  if (!env.SLACK_LOGGING_ENABLED) {
    return Promise.resolve()
  }
  return sendSlackMessage(
    channel,
    `${message}: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`,
  )
}

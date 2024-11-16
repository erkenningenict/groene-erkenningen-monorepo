import logger from './logger'
import { sendSlackErrorMessage } from './slack'

export const getBasicAuth = (username: string, password: string) =>
  Buffer.from(`${username}:${password}`).toString('base64')

export const getSoapHeaders = (
  soapAction: string,
  username: string,
  password: string,
) => ({
  'Content-Type': 'text/xml;charset=UTF-8',
  soapAction: soapAction,
  Authorization: `Basic ${getBasicAuth(username, password)}`,
})

export const getSoapRequest = (body: string) => {
  return `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:soap="http://www.triggre.com/2018/soap">
    <soapenv:Header/>
    <soapenv:Body>${body}
    </soapenv:Body>
 </soapenv:Envelope>`
}

export const getSoapBody = async (
  soapUrl: string,
  url: string,
  username: string,
  password: string,
  soapRequestBody: string,
  loggingContext: string,
) => {
  const soapHeaders = getSoapHeaders(url, username, password)

  const profiler = logger.startTimer()
  logger.debug(
    `Soap request to url ${loggingContext}, soapRequestBody: ${soapRequestBody}`,
  )
  const response = await fetch(soapUrl, {
    method: 'POST',
    headers: soapHeaders,
    body: getSoapRequest(soapRequestBody),
  })
  profiler.done({
    message: `Soap request successful. Context: ${loggingContext}`,
  })
  const body = await response.text()

  if (response.status === 200) {
    logger.debug(`Body for soapUrl:\n${body}`)
    return body
  } else {
    const errorMessage = new Error(
      `Unexpected status code for url: ${soapUrl}, Response status: ${response.status}, Status: ${response.statusText}, body: ${body}`,
    )
    sendSlackErrorMessage({
      channel: 'error',
      message: `Error getting soap response for ${soapUrl}`,
      error: errorMessage,
    })
    logger.error(errorMessage)
    throw errorMessage
  }
}

export const getNumberArrayResult = <InputType>(
  value: InputType,
  index: number,
) => {
  if (Array.isArray(value)) {
    const val = value.at(index)
    if (typeof value.at(index) === 'object') {
      return 0
    }
    if (typeof val === 'string') {
      return +val
    } else {
      return 0
    }
  }
  if (Number(value)) {
    return Number(value)
  }
  return 0
}

export const getNewNumberArrayResult = <InputType>(
  value: InputType,
  index: number,
  defaultValue = 0,
) => {
  if (Array.isArray(value)) {
    const val = value.at(index)
    if (val._ === undefined) {
      return defaultValue
    }
    return +val._ as number
  }
  if (Number((value as { _: number })._)) {
    return Number((value as { _: number })._)
  }
  return defaultValue
}

export const getStringArrayResult = <InputType>(
  value: InputType,
  index: number,
) => {
  if (Array.isArray(value)) {
    const val = value.at(index)
    return val
  }
  return value
}

export const getNewStringArrayResult = <InputType>(
  value: InputType,
  index: number,
) => {
  if (Array.isArray(value)) {
    const val = value.at(index)
    if (typeof val._ === 'undefined') {
      return ''
    }
    return val._.trim()
  }
  const retVal = value as { _: string | undefined }
  if (retVal && typeof retVal._ === 'undefined') {
    return ''
  }
  return retVal && retVal._
}

export type SoapNull = { $: { 'i:nil': string } }
export type SoapString = SoapNull | string
export type SoapNewString = { _: string; $?: { 'i:nil': Object } }
export type SoapDecimal = SoapNull | number

export const getNullableString = (value: SoapString) => {
  if (typeof value === 'object') {
    return ''
  }
  if (typeof value === 'string') {
    return value
  }
  return ''
}

export const getNullableNumber = (value: SoapDecimal | undefined) => {
  if (typeof value === 'object') {
    return 0
  }
  if (typeof value === 'string') {
    return value
  }
  return 0
}

export const getNullableNumberStringDefault = (
  value: SoapDecimal | undefined,
  defaultValue: string = 'onbekend',
) => {
  if (typeof value === 'object') {
    return defaultValue
  }
  if (typeof value === 'string') {
    return value
  }
  return defaultValue
}

export const getDateArrayResult = <InputType>(
  value: InputType,
  index: number,
) => {
  if (Array.isArray(value)) {
    const val = value.at(index)
    return new Date(val.DateTime)
  }
  if ((value as unknown as any)?.DateTime) {
    return new Date((value as unknown as any).DateTime)
  }
  return new Date(1970, 0, 1)
}

export const getCheckCertificaatDateArrayResult = <InputType>(
  value: InputType,
  index: number,
) => {
  if (Array.isArray(value)) {
    const val = value.at(index)

    return (val._ as string)?.trim()
  }
  if ((value as unknown as { _: string })?._) {
    return ((value as unknown as { _: string })._ as string).trim()
  }
  return new Date(1970, 0, 1).toISOString()
}

export const getExamenMomentenDateArrayResult = <InputType>(
  value: InputType,
  index: number,
) => {
  if (Array.isArray(value)) {
    const val = value.at(index)

    return (val.DateTime as string)?.trim()
  }
  if ((value as unknown as { _: string })?._) {
    return ((value as unknown as { _: string })._ as string).trim()
  }
  return new Date(1970, 0, 1).toISOString()
}

export const getNewDateResult = <InputType>(value: InputType) => {
  if ((value as unknown as { _: string })?._) {
    return new Date(((value as unknown as { _: string })._ as string).trim())
  }
  return new Date(1970, 0, 1)
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function getMockFile(fileName: string): Promise<string> {
  return await Bun.file(fileName).text()
}

export const euroFormatter = Intl.NumberFormat('nl-NL', {
  style: 'currency',
  currency: 'EUR',
})

export async function logAndThrowError(message: string, error: any) {
  await sendSlackErrorMessage({
    message,
    error,
  })
  logger.error(message)
  throw new Error(message)
}

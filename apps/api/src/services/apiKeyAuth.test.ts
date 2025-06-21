import { describe, expect, it } from 'vitest'
import { apiKeyAuth } from './apiKeyAuth'
import { Elysia } from 'elysia'

export const req = (path: string, requestInit?: RequestInit) =>
  new Request(`http://localhost${path}`, requestInit)

const apiKey = 'test'
const userInit = { headers: { 'x-api-key': 'test' } }

describe('apiKeyAuth', () => {
  const app = new Elysia()
    .use(
      apiKeyAuth({
        apiKey,
      }),
    )
    .get('/private', () => 'private')
    .options('/private', () => 'public for preflight requests')

  it('sets status code on unauthorized requests', async () => {
    const anonResponse = await app.handle(req('/private'))
    expect(anonResponse.status).toEqual(401)

    const userResponse = await app.handle(req('/private', userInit))
    expect(userResponse.status).toEqual(200)
  })

  it('protects non-existing routes', async () => {
    const anonRequest = req('/missing')
    expect((await app.handle(anonRequest)).status).toEqual(401)

    const userRequest = req('/missing', userInit)
    expect((await app.handle(userRequest)).status).toEqual(404)
  })
})

describe('apiKeyAuth skipCorsPreflight', () => {
  const preflightRequest = req('/private', {
    method: 'OPTIONS',
    headers: {
      Origin: 'foreignhost',
      'Cross-Origin-Request-Method': 'GET',
    },
  })
  it('no bypass by default', async () => {
    const app = new Elysia()
      .use(apiKeyAuth())
      .options('/private', () => 'private')
    expect((await app.handle(preflightRequest)).status).toEqual(401)
  })
})

describe('apiKeyAuth message customization', () => {
  const app = new Elysia().use(
    apiKeyAuth({ apiKey, unauthorizedMessage: 'Nope' }),
  )

  it('allows for custom message', async () => {
    const anonResponse = await app.handle(req('/private'))
    expect(await anonResponse.text()).toEqual('Nope')
  })
})

describe('apiKeyAuth proxy customization', () => {
  const app = new Elysia()
    .use(
      apiKeyAuth({
        apiKey,
        header: 'Proxy-Authorization',
        unauthorizedStatus: 407,
      }),
    )
    .get('/private', () => 'private')

  it('allows for custom status code', async () => {
    const anonResponse = await app.handle(req('/private'))
    expect(anonResponse.status).toEqual(407)
  })
})

describe('apiKeyAuth scope', () => {
  it('limits scope via function', async () => {
    const app = new Elysia()
      .use(
        apiKeyAuth({
          apiKey,
          scope: ctx => ctx.request.url.endsWith('1234'),
        }),
      )
      .get('/private/1234', () => 'private')

    expect((await app.handle(req('/private/1234'))).status).toEqual(401)
  })

  it('limits scope via a collection of path prefixes', async () => {
    const app = new Elysia().use(
      apiKeyAuth({ apiKey, scope: ['/private', '/admin'] }),
    )

    const privateResponse = await app.handle(req('/private'))
    const adminResponse = await app.handle(req('/admin'))
    expect(privateResponse.status).toEqual(401)
    expect(adminResponse.status).toEqual(401)
  })
})

describe('apiKeyAuth enabled', () => {
  it("doesn't require auth if disabled", async () => {
    const app = new Elysia()
      .use(apiKeyAuth({ enabled: false }))
      .get('/private', () => 'private')

    expect((await app.handle(req('/private'))).status).toEqual(200)
  })
})

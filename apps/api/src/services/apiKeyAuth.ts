// based on: https://github.com/eelkevdbos/elysia-basic-auth/blob/main/src/index.ts V2.0.0
import Elysia, { type PreContext } from 'elysia'

export type ApiKeyAuthCredentials = {
  key: string
}

class ApiKeyAuthError extends Error {
  public code = 'API_KEY_AUTH_ERROR'

  constructor(readonly message: string) {
    super(message)
  }
}

export type ApiKeyAuthOptions = {
  enabled: boolean
  apiKey: string
  header: string
  realm: string
  unauthorizedMessage: string
  unauthorizedStatus: number
  scope: string | string[] | ((ctx: PreContext) => boolean)
  // skipCorsPreflight: boolean
}

const defaultOptions = {
  enabled: true,
  apiKey: 'API_KEY',
  header: 'x-api-key',
  realm: 'Secure Area',
  unauthorizedMessage: 'Unauthorized',
  unauthorizedStatus: 401,
  scope: '/',
  // skipCorsPreflight: false,
}

/**
 * Extracts pathname from request url
 */
function getPath(request: Request) {
  return new URL(request.url).pathname
}

/**
 * Creates a predicate function for the scope option
 */
function newScopePredicate(scope: ApiKeyAuthOptions['scope']) {
  switch (typeof scope) {
    case 'string':
      return (ctx: PreContext) => getPath(ctx.request).startsWith(scope)
    case 'function':
      return scope
    case 'object':
      if (Array.isArray(scope)) {
        return (ctx: PreContext) =>
          scope.some(s => getPath(ctx.request).startsWith(s))
      }
    default:
      throw new Error(`Unhandled scope type: ${typeof scope}`)
  }
}

function checkApiKey(authHeader: string | null, apiKey: string) {
  if (!authHeader || authHeader !== apiKey) {
    return false
  }
  return true
}

export function apiKeyAuth(userOptions: Partial<ApiKeyAuthOptions> = {}) {
  const options: ApiKeyAuthOptions = {
    ...defaultOptions,
    ...userOptions,
  }

  const inScope = newScopePredicate(options.scope)

  return new Elysia({
    name: 'elysia-api-key-auth',
    seed: options,
  })
    .error({ API_KEY_AUTH_ERROR: ApiKeyAuthError })
    .onError({ as: 'global' }, ({ code, error }) => {
      if (code === 'API_KEY_AUTH_ERROR') {
        return new Response(options.unauthorizedMessage, {
          status: options.unauthorizedStatus,
          headers: { 'x-api-key': '' },
        })
      }
    })
    .onRequest(ctx => {
      if (options.enabled && inScope(ctx)) {
        const authHeader = ctx.request.headers.get(options.header)
        if (!authHeader) {
          throw new ApiKeyAuthError('Invalid header')
        }

        if (!checkApiKey(authHeader, options.apiKey)) {
          throw new ApiKeyAuthError('Invalid credentials')
        }
      }
    })
}

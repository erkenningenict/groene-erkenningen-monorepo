import { Elysia } from 'elysia'
import { html, Html } from '@elysiajs/html'
import { examenMomentenEndpoints } from './src/endpoints/examenMomentenEndpoints'
import logger from './src/utils/logger'
import env from './env'
import { apiKeyAuth } from './src/services/apiKeyAuth'
import db from './src/db/db'
import { publicRegisterEndpoints } from './src/endpoints/publicRegisterEndpoints'
import cors from '@elysiajs/cors'

const app = new Elysia()
  .use(cors())
  .use(
    apiKeyAuth({
      enabled: true,
      apiKey: env.API_KEY_FETCHER,
      scope: '/examenMomenten',
    }),
  )
  .use(html())
  .head('/', async ({ set }) => {
    set.status = 200
    set.headers['content-type'] = 'text/plain'
    await db.query.config.findFirst()
    return 'OK'
  })
  .get('/', ({ set }) => {
    set.headers['content-type'] = 'text/html; charset=utf-8'
    set.headers['vary'] = 'Accept-Encoding'
    return (
      <html lang="en">
        <head>
          <title>Default</title>
        </head>
        <body>
          <h1>Examenservices fetcher</h1>
          <a href="./examenMomenten">Naar Examenmomenten fetcher</a>
        </body>
      </html>
    )
  })
  .use(examenMomentenEndpoints)
  .use(publicRegisterEndpoints)
  .listen(3000)

logger.info(`CRON_EXAMENMOMENTEN_ENABLED: ${env.CRON_EXAMENMOMENTEN_ENABLED}`)
logger.info(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
)

export { type SelectConfig } from './src/db/schema'
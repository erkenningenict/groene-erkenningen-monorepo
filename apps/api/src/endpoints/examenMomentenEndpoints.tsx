import cron from '@elysiajs/cron'
import Elysia from 'elysia'
import { html, Html } from '@elysiajs/html'
import env from '../utils/env'
import logger from '../utils/logger'
import { examenMomentenProcessor } from '../services/examenMomentenProcessor.js'
import { format } from 'date-fns'

export const examenMomentenEndpoints = new Elysia({ prefix: 'examenMomenten' })

  .use(
    cron({
      name: 'examenMomenten',
      pattern: env.CRON_EXAMENMOMENTEN_SCHEDULE,
      async run() {
        logger.info(
          `Examen momenten cron runs. Processing enabled: ${env.CRON_EXAMENMOMENTEN_ENABLED}`,
        )
        if (!env.CRON_EXAMENMOMENTEN_ENABLED) {
          return
        }

        await examenMomentenProcessor()
      },
    }),
  )
  .get(
    '/',
    ({
      store: {
        cron: { examenMomenten },
      },
    }) => {
      return (
        <html lang="en">
          <head>
            <title>Actions</title>
          </head>
          <body>
            <h1>Examenmomenten fetcher acties</h1>
            <ul>
              <li>
                <a href="examenMomenten/pause">Pause cron job</a>
              </li>
              <li>
                <a href="examenMomenten/resume">Resume cron job</a>
              </li>
              <li>
                <a href="examenMomenten/nextRun">Next run</a>
              </li>
              <li>
                <a href="examenMomenten/runNow">Run now</a>
              </li>
              <li>Schedule: {env.CRON_EXAMENMOMENTEN_SCHEDULE}.</li>
              <li>
                Cronjob is running status:{' '}
                {examenMomenten.isRunning() ? 'yes' : 'no'}.
              </li>
              <li>
                Processing enabled?{' '}
                {env.CRON_EXAMENMOMENTEN_ENABLED ? 'yes' : 'no'}.
              </li>
            </ul>
          </body>
        </html>
      )
    },
  )

  .get(
    '/pause',
    ({
      store: {
        cron: { examenMomenten },
      },
    }) => {
      examenMomenten.pause()

      return (
        <html lang="en">
          <head>
            <title>Pause</title>
          </head>
          <body>
            <h1>Examenservices fetcher cron job</h1>
            <ul>
              <li>Processing enabled: {env.CRON_EXAMENMOMENTEN_ENABLED}.</li>
              <li>Schedule: {env.CRON_EXAMENMOMENTEN_SCHEDULE}.</li>
              <li>
                Cronjob is running status:{' '}
                {examenMomenten.isRunning() ? 'yes' : 'no'}.
              </li>
              <li>
                Processing enabled?{' '}
                {env.CRON_EXAMENMOMENTEN_ENABLED ? 'yes' : 'no'}.
              </li>
            </ul>
          </body>
        </html>
      )
    },
  )
  .get(
    '/resume',
    ({
      store: {
        cron: { examenMomenten },
      },
    }) => {
      examenMomenten.resume()

      return (
        <html lang="en">
          <head>
            <title>Resume</title>
          </head>
          <body>
            <h1>Examenservices fetcher resume</h1>
            <ul>
              <li>Resume examen momenten cron job.</li>
              <li>Processing enabled: {env.CRON_EXAMENMOMENTEN_ENABLED}.</li>
              <li>Schedule: {env.CRON_EXAMENMOMENTEN_SCHEDULE}.</li>
              <li>
                Cronjob is running status:{' '}
                {examenMomenten.isRunning() ? 'yes' : 'no'}.
              </li>
              <li>
                Processing enabled?{' '}
                {env.CRON_EXAMENMOMENTEN_ENABLED ? 'yes' : 'no'}.
              </li>
            </ul>
          </body>
        </html>
      )
    },
  )
  .get(
    '/nextRun',
    ({
      store: {
        cron: { examenMomenten },
      },
    }) => {
      return (
        <html lang="en">
          <head>
            <title>Next run</title>
          </head>
          <body>
            <h1>Examenservices fetcher next run</h1>
            <ul>
              <li>
                Next run at:{' '}
                {format(
                  new Date(
                    (examenMomenten.nextRun() ?? new Date())?.toISOString(),
                  ),
                  'dd-MM-yyyy hh:mm:ss',
                )}
                .
              </li>
              <li>Processing enabled: {env.CRON_EXAMENMOMENTEN_ENABLED}.</li>
              <li>Schedule: {env.CRON_EXAMENMOMENTEN_SCHEDULE}.</li>
              <li>
                Cronjob is running status:{' '}
                {examenMomenten.isRunning() ? 'yes' : 'no'}.
              </li>
              <li>
                Processing enabled?{' '}
                {env.CRON_EXAMENMOMENTEN_ENABLED ? 'yes' : 'no'}.
              </li>
            </ul>
          </body>
        </html>
      )
    },
  )
  .get('/runNow', async () => {
    await examenMomentenProcessor()
    return (
      <html lang="en">
        <head>
          <title>Finished</title>
        </head>
        <body>
          <h1>Examenservices fetcher finished</h1>
        </body>
      </html>
    )
  })

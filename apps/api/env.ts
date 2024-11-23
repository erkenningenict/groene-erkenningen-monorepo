// import { config } from "dotenv";
// import { expand } from "dotenv-expand";

import * as v from 'valibot'

const stringBoolean = v.optional(
  v.pipe(
    v.string(),
    v.transform(val => {
      if (val === undefined) {
        return false
      }
      return val.toLowerCase() === 'true'
    }),
  ),
  'false',
)

enum LogLevels {
  info = 'info',
  warning = 'warning',
  debug = 'debug',
  error = 'error',
}

const EnvSchema = v.object({
  NODE_ENV: v.optional(v.string(), 'development'),
  ALLOWED_ORIGINS: v.pipe(
    v.string(),
    v.transform(val => val.split(',')),
  ),

  // DB_HOST: v.string(),
  // DB_USER: v.string(),
  // DB_PASSWORD: v.string(),
  // DB_NAME: v.string(),
  // DB_PORT: v.coerce.number(),
  DB_URL: v.string(),
  DB_MIGRATING: stringBoolean,
  DB_SEEDING: stringBoolean,
  API_KEY_FETCHER: v.string(),
  LOGGING_ENABLED: stringBoolean,
  LOG_LEVEL: v.optional(v.enum(LogLevels), LogLevels.info),
  SLACK_API_URL: v.pipe(v.string(), v.url()),
  SLACK_TOKEN: v.string(),
  CRON_EXAMENMOMENTEN_ENABLED: stringBoolean,
  CRON_EXAMENMOMENTEN_SCHEDULE: v.optional(v.pipe(v.string()), '0 0 * * *'),
  NO_OF_DAYS_TO_FETCH: v.optional(v.pipe(v.unknown(), v.transform(Number)), 30),
  EXAMEN_SERVICES_API_USERNAME: v.string(),
  SOAP_URL_EXAMEN_MOMENTEN: v.string(),
  PASSWORD_EXAMEN_MOMENTEN: v.string(),
  SOAP_URL_CHECK_CERTIFICAAT: v.string(),
  PASSWORD_CHECK_CERTIFICAAT: v.string(),
  ORGANISATION_CODE_CHECK_CERTIFICAAT: v.string(),
})

export type EnvSchema = v.InferOutput<typeof EnvSchema>

try {
  v.parse(EnvSchema, process.env)
} catch (error) {
  console.log('#DH# Error parsing env variables', error)
  // if (error instanceof ZodError) {
  //   let message = 'Missing required values in .env:\n'
  //   error.issues.forEach(issue => {
  //     message += issue.path[0] + '\n'
  //   })
  //   const e = new Error(message)
  //   e.stack = ''
  //   throw e
  // } else {
  //   console.error(error)
  // }
}

export default v.parse(EnvSchema, process.env)

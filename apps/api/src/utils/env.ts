import * as v from 'valibot'
import { nrOfDaysToFetch } from '../services/constants'

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

  DB_URL: v.string(),
  DB_MIGRATING: stringBoolean,
  DB_SEEDING: stringBoolean,
  API_KEY_FETCHER: v.string(),
  LOGGING_ENABLED: stringBoolean,
  LOG_LEVEL: v.optional(v.enum(LogLevels), LogLevels.info),
  SLACK_LOGGING_ENABLED: stringBoolean,
  SLACK_API_URL: v.pipe(v.string(), v.url()),
  SLACK_TOKEN: v.string(),
  CRON_EXAMENMOMENTEN_ENABLED: stringBoolean,
  CRON_EXAMENMOMENTEN_SCHEDULE: v.optional(v.pipe(v.string()), '0 0 * * *'),
  NO_OF_DAYS_TO_FETCH: v.optional(
    v.pipe(v.unknown(), v.transform(Number)),
    nrOfDaysToFetch,
  ),
  EXAMEN_SERVICES_API_USERNAME: v.string(),
  SOAP_URL_EXAMEN_MOMENTEN: v.string(),
  PASSWORD_EXAMEN_MOMENTEN: v.string(),
  SOAP_URL_CHECK_CERTIFICAAT: v.string(),
  PASSWORD_CHECK_CERTIFICAAT: v.string(),
  ORGANISATION_CODE_CHECK_CERTIFICAAT: v.string(),
  PASSWORD_LOS_EXAMEN_MOMENT: v.string(),
  SOAP_URL_LOS_EXAMEN_MOMENT: v.string(),
})

export type EnvSchema = v.InferOutput<typeof EnvSchema>

function envParser() {
  const envParser = v.safeParser(EnvSchema)
  const result = envParser(process.env)
  if (!result.success) {
    const issues = v.summarize(result.issues)
    console.error('Error parsing env variables', issues)
    // process.exit(1)
  }
  return v.parse(EnvSchema, process.env)
}

export default envParser()

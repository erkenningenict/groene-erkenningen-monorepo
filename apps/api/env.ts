// import { config } from "dotenv";
// import { expand } from "dotenv-expand";

import { ZodError, z } from 'zod'

const stringBoolean = z.coerce
  .string()
  .transform(val => {
    return val === 'true'
  })
  .default('false')

const EnvSchema = z.object({
  NODE_ENV: z.string().default('development'),
  // DB_HOST: z.string(),
  // DB_USER: z.string(),
  // DB_PASSWORD: z.string(),
  // DB_NAME: z.string(),
  // DB_PORT: z.coerce.number(),
  DB_URL: z.string(),
  DB_MIGRATING: stringBoolean,
  DB_SEEDING: stringBoolean,
  API_KEY_FETCHER: z.string().uuid(),
  LOGGING_ENABLED: stringBoolean,
  LOG_LEVEL: z.enum(['info', 'warning', 'debug', 'error']).default('info'),
  SLACK_API_URL: z.string().url(),
  SLACK_TOKEN: z.string(),
  CRON_EXAMENMOMENTEN_ENABLED: stringBoolean,
  CRON_EXAMENMOMENTEN_SCHEDULE: z.string().default('0 0 * * *'),
  NO_OF_DAYS_TO_FETCH: z.coerce.number().default(30),
  EXAMEN_SERVICES_API_USERNAME: z.string(),
  SOAP_URL_EXAMEN_MOMENTEN: z.string(),
  PASSWORD_EXAMEN_MOMENTEN: z.string(),
})

export type EnvSchema = z.infer<typeof EnvSchema>

try {
  EnvSchema.parse(process.env)
} catch (error) {
  if (error instanceof ZodError) {
    let message = 'Missing required values in .env:\n'
    error.issues.forEach(issue => {
      message += issue.path[0] + '\n'
    })
    const e = new Error(message)
    e.stack = ''
    throw e
  } else {
    console.error(error)
  }
}

export default EnvSchema.parse(process.env)

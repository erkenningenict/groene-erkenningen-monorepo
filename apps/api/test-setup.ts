// Test setup for Bun test runner
// This file loads environment variables for testing

import { readFileSync, existsSync } from 'fs'
import path, { join } from 'path'

// Function to load .env.test file if it exists
function loadEnvTest() {
  // Look for .env.test in the current working directory (apps/api when run from VS Code)
  console.log(process.cwd())
  console.log(path.resolve(__dirname, '.env.test'))
  const envTestPath = join(path.resolve(__dirname, '.env.test'))

  if (existsSync(envTestPath)) {
    console.log('Loading .env.test file...')
    const envContent = readFileSync(envTestPath, 'utf-8')

    envContent.split('\n').forEach(line => {
      const trimmedLine = line.trim()
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=')
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim()
          process.env[key.trim()] = value
        }
      }
    })
    console.log('✅ Loaded .env.test file')
  } else {
    console.log('⚠️  No .env.test file found, using default test values')
  }
}

// Load .env.test file if it exists
loadEnvTest()

// Set default test environment variables (fallback values)
// const defaultEnvVars = {
//   NODE_ENV: 'test',
//   ALLOWED_ORIGINS: 'http://localhost:3000,http://localhost:5173',
//   DB_URL: 'postgresql://test:test@localhost:5432/test_db',
//   DB_MIGRATING: 'false',
//   DB_SEEDING: 'false',
//   API_KEY_FETCHER: 'test-api-key',
//   LOGGING_ENABLED: 'false',
//   LOG_LEVEL: 'error',
//   SLACK_LOGGING_ENABLED: 'false',
//   SLACK_API_URL: 'https://hooks.slack.com/test',
//   SLACK_TOKEN: 'test-token',
//   CRON_EXAMENMOMENTEN_ENABLED: 'false',
//   CRON_EXAMENMOMENTEN_SCHEDULE: '0 0 * * *',
//   NO_OF_DAYS_TO_FETCH: '30',
//   EXAMEN_SERVICES_API_USERNAME: 'test',
//   SOAP_URL_EXAMEN_MOMENTEN: 'http://test.example.com',
//   PASSWORD_EXAMEN_MOMENTEN: 'test',
//   SOAP_URL_CHECK_CERTIFICAAT:
//     'https://mijn.ibki.nl/main/interfaces/soap11/apicheckcertificaat?wsdl',
//   PASSWORD_CHECK_CERTIFICAAT: 'test',
//   ORGANISATION_CODE_CHECK_CERTIFICAAT: 'test',
//   PASSWORD_LOS_EXAMEN_MOMENT: 'test',
//   SOAP_URL_LOS_EXAMEN_MOMENT: 'http://test.example.com',
// }

// // Set default values only if not already set by .env.test
// Object.entries(defaultEnvVars).forEach(([key, value]) => {
//   if (!process.env[key]) {
//     process.env[key] = value
//   }
// })

console.log('✅ Test environment variables loaded')

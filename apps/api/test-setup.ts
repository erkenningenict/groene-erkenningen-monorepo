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

console.log('✅ Test environment variables loaded')

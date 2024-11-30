import * as winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import env from './env'
const { combine, timestamp, errors, splat, simple, cli } = winston.format

const consoleOptions = {
  console: {
    level: env.LOG_LEVEL || 'info',
    handleExceptions: false,
    format: combine(errors({ stack: true }), timestamp(), cli(), simple()),
  },
}

const dailyRotateFileTransport: DailyRotateFile = new DailyRotateFile({
  filename: '%DATE%-app.log',
  dirname: 'logs',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  handleExceptions: false,
  format: combine(errors({ stack: true }), timestamp(), splat(), simple()),
})

const transportsCollection: any[] = [
  dailyRotateFileTransport,
  new winston.transports.Console(consoleOptions.console),
]
if (env.NODE_ENV !== 'test' && env.LOGGING_ENABLED) {
  console.log(`Logging enabled with level: ${env.LOG_LEVEL}`)
}

const logger = winston.createLogger({
  transports: transportsCollection,
  level: env.LOG_LEVEL || 'info',
  exitOnError: true,
})
logger.on('error', function (err: Error) {
  console.error(err)
})

export default logger

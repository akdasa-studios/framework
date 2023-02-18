import { LogRecord, Logs, LogTransport, Logger, LogLevel } from '@lib/core'


class MockTransport implements LogTransport {
  public lastRecord: LogRecord | undefined
  log(record: LogRecord): void {
    this.lastRecord = record
  }
}


describe('LogsController', () => {
  describe('.register()', () => {
    it('should register a transport', () => {
      const transport = new MockTransport()
      const logger = new Logger('test')

      Logs.register(transport)
      logger.log(LogLevel.DEBUG, 'message', { test: 'test' })

      expect(transport.lastRecord).toBeDefined()
      expect(transport.lastRecord?.context).toBe('test')
      expect(transport.lastRecord?.message).toBe('message')
      expect(transport.lastRecord?.level).toBe(LogLevel.DEBUG)
      expect(transport.lastRecord?.timestamp).toBeDefined()
      expect(transport.lastRecord?.data).toEqual({ test: 'test' })
    })
  })
})

describe('Logger', () => {
  const transport = new MockTransport()
  const logger = new Logger('test')
  Logs.register(transport)

  describe('.log()', () => {
    it('log a message', () => {
      logger.log(LogLevel.DEBUG, 'message')
      expect(transport.lastRecord?.level).toBe(LogLevel.DEBUG)
    })

    it('debug level', () => {
      logger.debug('message')
      expect(transport.lastRecord?.level).toBe(LogLevel.DEBUG)
    })

    it('info level', () => {
      logger.info('message')
      expect(transport.lastRecord?.level).toBe(LogLevel.INFO)
    })

    it('warn level', () => {
      logger.warn('message')
      expect(transport.lastRecord?.level).toBe(LogLevel.WARN)
    })

    it('error level', () => {
      logger.error('message')
      expect(transport.lastRecord?.level).toBe(LogLevel.ERROR)
    })

    it('fatal level', () => {
      logger.fatal('message')
      expect(transport.lastRecord?.level).toBe(LogLevel.FATAL)
    })
  })
})
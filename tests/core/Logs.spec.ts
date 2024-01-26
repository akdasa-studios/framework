import { LogRecord, Logs, LogTransport, Logger, LogLevel, MessageLogRecord } from '@akd-studios/framework/core'


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
      const lastRecord = transport.lastRecord as MessageLogRecord

      expect(lastRecord).toBeDefined()
      expect(lastRecord.context).toBe('test')
      expect(lastRecord.message).toBe('message')
      expect(lastRecord.level).toBe(LogLevel.DEBUG)
      expect(lastRecord.timestamp).toBeDefined()
      expect(lastRecord.data).toEqual({ test: 'test' })
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
      const lastRecord = transport.lastRecord as MessageLogRecord
      expect(lastRecord.type).toBe('log')
      expect(lastRecord.level).toBe(LogLevel.DEBUG)
    })

    it('debug level', () => {
      logger.debug('message')
      const lastRecord = transport.lastRecord as MessageLogRecord
      expect(lastRecord.type).toBe('log')
      expect(lastRecord.level).toBe(LogLevel.DEBUG)
    })

    it('info level', () => {
      logger.info('message')
      const lastRecord = transport.lastRecord as MessageLogRecord
      expect(lastRecord.type).toBe('log')
      expect(lastRecord.level).toBe(LogLevel.INFO)
    })

    it('warn level', () => {
      logger.warn('message')
      const lastRecord = transport.lastRecord as MessageLogRecord
      expect(lastRecord.type).toBe('log')
      expect(lastRecord.level).toBe(LogLevel.WARN)
    })

    it('error level', () => {
      logger.error('message')
      const lastRecord = transport.lastRecord as MessageLogRecord
      expect(lastRecord.type).toBe('log')
      expect(lastRecord.level).toBe(LogLevel.ERROR)
    })

    it('fatal level', () => {
      logger.fatal('message')
      const lastRecord = transport.lastRecord as MessageLogRecord
      expect(lastRecord.type).toBe('log')
      expect(lastRecord.level).toBe(LogLevel.FATAL)
    })
  })

  describe('.startGroup()', () => {
    it('start a group', () => {
      logger.startGroup('group')
      const lastRecord = transport.lastRecord as MessageLogRecord
      expect(lastRecord.type).toBe('start-group')
    })
  })

  describe('.endGroup()', () => {
    it('end a group', () => {
      logger.endGroup()
      const lastRecord = transport.lastRecord as MessageLogRecord
      expect(lastRecord.type).toBe('end-group')
    })
  })
})
/**
 * Level of logging
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}


/**
 * A log record. This is the data that is passed to the transports.
 */
export interface MessageLogRecord {
  type: 'log'
  level: LogLevel
  context: string
  message: string
  timestamp: number
  data?: unknown
}

export interface StartGroupLogRecord {
  type: 'start-group'
  label: string
}

export interface EndGroupLogRecord {
  type: 'end-group'
}

export type LogRecord = MessageLogRecord | StartGroupLogRecord | EndGroupLogRecord

/**
 * A transport is a class that is responsible for actually logging the data.
 */
export interface LogTransport {
  log(record: LogRecord): void
}


/**
 * The LogsController is responsible for managing the transports and passing
 * log records to them. It is a singleton.
 */
export class LogsController {
  private transports: LogTransport[] = []

  /**
   * Add a transport to the controller.
   * @param transport The transport to add
   */
  public register(transport: LogTransport) {
    this.transports.push(transport)
  }

  public log(record: LogRecord) {
    this.transports.forEach(transport => transport.log(record))
  }
}


/**
 * The Logger class is responsible for creating a log record and passing it to
 * the LogsController.
 */
export class Logger {
  /**
   * Initialize a new logger.
   * @param context The context of the logger. This is used to identify the source of the log.
   */
  constructor (
    private context: string
  ) {}

  /**
   * Start a new group of logs.
   * @param label Label of the group
   */
  public startGroup(label: string) {
    Logs.log({
      type: 'start-group',
      label
    })
  }

  /**
   * End the current group of logs.
   */
  public endGroup() {
    Logs.log({
      type: 'end-group'
    })
  }

  /**
   * Logs a message.
   * @param level Log level
   * @param message Message to log
   */
  public log(level: LogLevel, message: string, data?: unknown) {
    Logs.log({
      type: 'log',
      level,
      context: this.context,
      message,
      timestamp: Date.now(),
      data
    })
  }

  /**
   * Debug level log.
   * @param message Message to log
   * @param data Data to log
   */
  public debug(message: string, data?: unknown) {
    this.log(LogLevel.DEBUG, message, data)
  }

  /**
   * Info level log.
   * @param message Message to log
   * @param data Data to log
   */
  public info(message: string, data?: unknown) {
    this.log(LogLevel.INFO, message, data)
  }

  /**
   * Warn level log.
   * @param message Message to log
   * @param data Data to log
   */
  public warn(message: string, data?: unknown) {
    this.log(LogLevel.WARN, message, data)
  }

  /**
   * Error level log.
   * @param message Message to log
   * @param data Data to log
   */
  public error(message: string, data?: unknown) {
    this.log(LogLevel.ERROR, message, data)
  }

  /**
   * Fatal level log.
   * @param message Message to log
   * @param data Data to log
   */
  public fatal(message: string, data?: unknown) {
    this.log(LogLevel.FATAL, message, data)
  }
}


/**
 * The singleton instance of the LogsController.
 */
export const Logs = new LogsController()

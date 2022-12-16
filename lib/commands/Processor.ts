import { AnyResult, Fail, NoResult, Ok, Result } from '@lib/core'
import { Command, AnyCommand } from './Command'


export class ProcessorResult<TCommandResult extends AnyResult> {
  constructor(
    public readonly processorResult: Result<boolean, string>,
    public readonly commandResult: TCommandResult = NoResult as TCommandResult,
  ) {}

  /**
   * Indicates if the command is executed.
   * @returns True if the command is executed, otherwise false.
   * @note This property is true if the command is executed successfully or failed.
   */
  get isCommandExecuted(): boolean {
    return this.processorResult.isSuccess
  }

  /**
   * Indicates if the command is executed successfully.
   * @returns True if the command is executed successfully, otherwise false.
   */
  get isCommandSucceeded(): boolean {
    return this.commandResult.isSuccess
  }

  /**
   * Gets the result of the executed command.
   * @returns {TCommandResult['value']} Returns the result of the executed command.
   */
  get value() : TCommandResult['value'] | TCommandResult['error'] {
    return this.commandResult.value
  }
}

/**
 * Transaction is a marker for a group of commands.
 */
export class Transaction {
  /**
   * Initialize a new instance of the Transaction class.
   * @param value Unique identifier of the transaction.
   */
  constructor(public readonly value: string) {}
}

/**
 * ExecutionStack is a stack of executed commands.
 */
interface ExecutionHistoryLine {
  command: AnyCommand,
  transactionId: Transaction | undefined
}

/**
 * ExecutionStack is a stack of executed commands.
 */
class ExecutionStack {
  private lines: ExecutionHistoryLine[] = []

  public push(command: AnyCommand, transactionId?: Transaction) {
    this.lines.push({command, transactionId})
  }

  public includes(command: AnyCommand) {
    return this.lines.map(r => r.command).includes(command)
  }

  public pop(): readonly AnyCommand[] {
    const lastRow = this.lines.pop()
    if (!lastRow) { return [] }
    if (!lastRow.transactionId) { return [lastRow.command] }

    const result = [lastRow.command]
    while (this.lines.at(-1)?.transactionId === lastRow.transactionId) {
      result.push((this.lines.pop() as ExecutionHistoryLine).command)
    }
    return result
  }
}

/**
 * Processor executes commands.
 */
export class Processor<TContext> {
  private stack = new ExecutionStack()

  /**
   * Initialize a new instance of the Processor class.
   * @param context Context of the processor.
   */
  constructor(
    public readonly context: TContext
  ) { }

  /**
   * Excecute the command.
   * @param command Command to process.
   * @param transaction Transaction.
   * @returns {ProcessorResult<TResult>} Returns the result execution.
   */
  execute<TResult extends AnyResult>(
    command: Command<TContext, TResult>,
    transaction?: Transaction
  ): ProcessorResult<TResult> {
    if (this.stack.includes(command)) {
      return new ProcessorResult(Fail('Command is already executed.'))
    }
    this.stack.push(command, transaction)
    const commandResult = command.execute(this.context)
    return new ProcessorResult<TResult>(Ok(), commandResult)
  }

  /**
   * Revert the last executed command.
   */
  revert(): ProcessorResult<Result<void, string>> {
    const commands = this.stack.pop()
    if (commands.length === 0) {
      return new ProcessorResult(Fail('No command to revert.'))
    }

    for (const command of commands) {
      command.revert(this.context)
    }
    return new ProcessorResult(Ok())
  }
}

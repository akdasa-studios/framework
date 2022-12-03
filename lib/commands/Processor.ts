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
 * Processor executes commands.
 */
export class Processor<TContext> {
  private stack: AnyCommand[] = []

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
   * @returns {ProcessorResult<TResult>} Returns the result execution.
   */
  execute<TResult extends AnyResult>(
    command: Command<TContext, TResult>
  ): ProcessorResult<TResult> {
    if (this.stack.includes(command)) {
      return new ProcessorResult(Fail('Command is already executed.'))
    }
    this.stack.push(command)
    const commandResult = command.execute(this.context)
    return new ProcessorResult<TResult>(Ok(), commandResult)
  }

  /**
   * Revert the last executed command.
   */
  revert<TResult extends AnyResult>(): ProcessorResult<TResult> {
    const command = this.stack.pop()
    if (!command) {
      return new ProcessorResult(Fail('Command is already executed.'))
    }

    const commandResult = command.revert(this.context)
    return new ProcessorResult<TResult>(Ok(), commandResult)
  }
}

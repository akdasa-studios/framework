import { type AnyResult, Event } from '@akd-studios/framework/core'
import { type AnyCommand, type Command, ExecutionStack, Transaction } from '@akd-studios/framework/commands'


/**
 * Processor executes commands.
 */
export class Processor<TContext> {
  private stack = new ExecutionStack()
  public readonly commandExecuted = new Event<Command<TContext, AnyResult>>()
  public readonly commandReverted = new Event<Command<TContext, AnyResult>>()

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
   * @returns {TResult} Returns the result of execution.
   */
  async execute<TResult extends AnyResult>(
    command: Command<TContext, TResult>,
    transaction?: Transaction
  ): Promise<TResult> {
    if (this.stack.includes(command)) {
      throw new Error('Command is already executed.')
    }
    this.stack.push(command, transaction)
    const commandResult = await command.execute(this.context)
    this.commandExecuted.notify(command)
    return commandResult
  }

  /**
   * Revert the last executed command.
   * @returns List of reverted commands.
   */
  async revert(): Promise<readonly AnyCommand[]> {
    const commands = this.stack.pop()

    for (const command of commands) {
      await command.revert(this.context)
      this.commandReverted.notify(command)
    }
    return commands
  }
}

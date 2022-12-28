import { AnyResult, Fail, Ok, Result } from '@lib/core'
import { Command } from './Command'
import { ExecutionStack } from './ExecutionStack'
import { ProcessorResult } from './ProcessorResult'
import { Transaction } from './Transaction'


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
  async execute<TResult extends AnyResult>(
    command: Command<TContext, TResult>,
    transaction?: Transaction
  ): Promise<ProcessorResult<TResult>> {
    if (this.stack.includes(command)) {
      return new ProcessorResult(Fail('Command is already executed.'))
    }
    this.stack.push(command, transaction)
    const commandResult = await command.execute(this.context)
    return new ProcessorResult<TResult>(Ok(), commandResult)
  }

  /**
   * Revert the last executed command.
   */
  async revert(): Promise<ProcessorResult<Result<void, string>>> {
    const commands = this.stack.pop()
    if (commands.length === 0) {
      return new ProcessorResult(Fail('No command to revert.'))
    }

    for (const command of commands) {
      await command.revert(this.context)
    }
    return new ProcessorResult(Ok())
  }
}

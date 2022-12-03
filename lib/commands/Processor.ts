import { AnyResult } from '@lib/core'
import { Command, AnyCommand } from './Command'

export class Processor {
  private stack: AnyCommand[] = []

  /**
   * Initialize a new instance of the Processor class.
   * @param context Context of the processor.
   */
  constructor(public readonly context: unknown) { }

  /**
   * Excecute the command.
   * @param command Command to process.
   * @returns {TResult} Returns the result of the command.
   */
  execute<TContext, TResult extends AnyResult>(command: Command<TContext, TResult>): TResult {
    if (this.stack.includes(command)) {
      throw new Error('Command is already executed.')
    }
    this.stack.push(command)
    return command.execute(this.context as TContext)
  }

  /**
   * Revert the last executed command.
   */
  revert(): void {
    const command = this.stack.pop()
    if (command) {
      command.revert(this.context)
    } else {
      throw new Error('No command to revert.')
    }
  }
}
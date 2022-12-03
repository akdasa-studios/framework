import { AnyResult } from '@lib/core'

/**
 * Command is the base class for all commands.
 */
export interface Command<
  TContext,
  TResult extends AnyResult
> {
  /**
   * Executes the command.
   * @param context The context in which the command is executed.
   * @returns The result of the command.
   */
  execute(context: TContext): TResult
  revert(context: TContext): void
}

/**
 * Any command that can be executed.
 */
export type AnyCommand = Command<unknown, AnyResult>

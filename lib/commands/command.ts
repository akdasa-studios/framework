/**
 * Command is the base class for all commands.
 */
export interface ICommand<TContext, TResult> {
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
export type AnyCommand = ICommand<unknown, unknown>
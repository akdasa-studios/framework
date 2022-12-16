import { AnyResult, NoResult, Result } from '@lib/core'



export class ProcessorResult<TCommandResult extends AnyResult> {
  constructor(
    public readonly processorResult: Result<boolean, string>,
    public readonly commandResult: TCommandResult = NoResult as TCommandResult
  ) { }

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
  get value(): TCommandResult['value'] | TCommandResult['error'] {
    return this.commandResult.value
  }
}

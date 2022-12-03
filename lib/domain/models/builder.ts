import { Result } from '@lib/core'

/**
 * Builds a new instance of the specified type or returns a failure result.
 */
export abstract class Builder<TModel, TError> {
  /**
   * Builds a new instance of the specified type or returns a failure result.
   * @returns A new instance of the specified type or a failure result.
   */
  public abstract build(): Result<TModel, TError>
}

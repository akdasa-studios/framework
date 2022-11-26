import { Result } from '@lib/core'

export abstract class Builder<TModel, TError> {
  public abstract build(): Result<TModel, TError>
}

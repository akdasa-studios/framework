
/**
 * Any result
 */
export type AnyResult = Result<unknown, unknown>

/**
 * Result is a discriminated union type that represents either a success or a failure.
 */
export class Result<
  TSuccess = void,
  TFailure = string
> implements Result<TSuccess, TFailure> {
  private readonly _success: boolean
  private readonly _payload: TSuccess | TFailure | undefined

  /**
   * Initializes a new instance of the Result class.
   * @param success Indicates if the result is a success or a failure.
   * @param payload The payload of the result.
   */
  private constructor(
    success: boolean,
    payload: TSuccess | TFailure | undefined,
  ) {
    this._success = success
    this._payload = payload
  }

  /**
   * Creates a new result indicating a success with the specified payload.
   * @param payload The payload of the result.
   * @returns A new instance of the Result class.
   */
  public static ok<TSuccessPayload, TFailPayload>(
    payload?: TSuccessPayload
  ): Result<TSuccessPayload, TFailPayload> {
    return new Result<TSuccessPayload, TFailPayload>(true, payload)
  }

  /**
   * Creates a new result indicating a failure with the specified payload.
   * @param payload The payload of the result.
   * @returns A new instance of the Result class.
   */
  public static fail<TSuccessPayload, TFailurePayload>(
    payload?: TFailurePayload
  ): Result<TSuccessPayload, TFailurePayload> {
    return new Result<TSuccessPayload, TFailurePayload>(false, payload)
  }

  /**
   * Indicates if the result is a success.
   * @returns True if the result is a success, otherwise false.
   */
  get isSuccess(): boolean {
    return this._success
  }

  /**
   * Indicates if the result is a failure.
   * @returns True if the result is a failure, otherwise false.
   */
  get isFailure(): boolean {
    return !this._success
  }

  /**
   * Gets the payload of the result.
   * @returns The payload of the result.
   */
  get value(): TSuccess {
    return this._payload as TSuccess
  }

  /**
   * Gets the payload of the result.
   * @returns The payload of the result.
   */
  get error(): TFailure {
    return this._payload as TFailure
  }
}

export const Ok = Result.ok
export const Fail = Result.fail
export const NoResult: Result<void, void> = Result.ok<void, void>(undefined)
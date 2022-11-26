
/**
 * Any result
 */
export type AnyResult = Result<unknown, unknown>

/**
 * Result is a discriminated union type that represents either a success or a failure.
 */
export class Result<
  TSuccess = void,
  TFail = string
> implements Result<TSuccess, TFail> {
  private readonly _success: boolean;
  private readonly _payload: TSuccess | TFail | undefined

  /**
   * Initializes a new instance of the Result class.
   * @param success Indicates if the result is a success or a failure.
   * @param payload The payload of the result.
   */
  private constructor(
    success: boolean,
    payload: TSuccess | TFail | undefined,
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
  public static fail<TSuccessPayload, TFailPayload>(
    payload?: TFailPayload
  ): Result<TSuccessPayload, TFailPayload> {
    return new Result<TSuccessPayload, TFailPayload>(false, payload)
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
  get error(): TFail {
    return this._payload as TFail
  }
}
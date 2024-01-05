import { v4, validate } from 'uuid'

/**
 * Identifies an entity.
 */
export class Identity<
  TValueType,
  TIdentityType
> {
  private _value: TValueType

  /**
   * Initialize the new instance of the Identity class
   * @param id Value.
   */
  constructor(value: TValueType) {
    this._value = value
  }

  /**
   * Gets the value of the Identity
   */
  get value(): TValueType {
    return this._value
  }

  /**
   * Compare the Identity to another Identity.
   * @param other Identity to compare to.
   * @returns True if the Identity is equal to the other Identity.
   */
  equals(other: Identity<TValueType, TIdentityType>): boolean {
    return this.value === other.value
  }

  /**
   * Identity brand
   */
  // @ts-ignore
  private __type__: TIdentityType
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyIdentity = Identity<any, unknown>

/**
 * UUID Identitiy
 */
export class UuidIdentity<Brand extends string> extends Identity<string, Brand> {
  /**
   * Initializes the new instance of the UuidIdentity
   */
  constructor(value?: string) {
    if (value && !validate(value)) {
      throw Error(`${value} is not valid UUID`)
    }
    super(value || v4())
  }
}

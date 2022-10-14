import { v4, validate } from 'uuid'

/**
 * Identifies an entity.
 */
export class Identity<TType, Brand> {
  private _value: TType

  /**
   * Initialize the new instance of the Identity class
   * @param id Value.
   */
  constructor(value: TType) {
    this._value = value
  }

  /**
   * Gets the value of the Identity
   */
  get value(): TType {
    return this._value
  }

  /**
   * Compare the Identity to another Identity.
   * @param other Identity to compare to.
   * @returns True if the Identity is equal to the other Identity.
   */
  equals(other: Identity<TType, Brand>): boolean {
    return this.value === other.value
  }

  /**
   * Identity brand
   */
  private __brand__: Brand
}


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

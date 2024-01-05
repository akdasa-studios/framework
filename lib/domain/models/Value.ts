import { Equalable } from './Interfaces'

export class Value<TValueType> implements Equalable<Value<TValueType>> {
  /**
   * Equality check of two values
   * @param value Value to compare to
   * @returns true if the value is equal to the other value
   */
  public equals(value: Value<TValueType>): boolean {
    return (
      // Stryker disable next-line all
      this.__type__ === value.__type__ &&
      // Stryker disable next-line all
      Object.keys(this).length === Object.keys(value).length &&
      // @ts-ignore
      Object.keys(this).every(key => this[key] === value[key])
    )
  }

  /**
   * Value type
   */
  // @ts-ignore
  private __type__: TValueType
}

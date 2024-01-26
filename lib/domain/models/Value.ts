import { type Equalable } from '@akd-studios/framework/domain/models'


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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      Object.keys(this).every(key => this[key] === value[key])
    )
  }

  /**
   * Value type
   */
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private __type__: TValueType
}
